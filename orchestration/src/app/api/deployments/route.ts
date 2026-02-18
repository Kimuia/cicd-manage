import { NextRequest, NextResponse } from 'next/server';
import { deploymentCreateSchema, listQuerySchema } from '@/lib/validation';
import { buildRepository } from '@/db/repositories/build.repository';
import { deploymentRepository } from '@/db/repositories/deployment.repository';
import { projectRepository } from '@/db/repositories/project.repository';
import { generateId } from '@/lib/id';
import { selectAgent, triggerDeployAndTrack } from '@/lib/agent-proxy';
import { badRequest, notFound, serverError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = listQuerySchema.parse(Object.fromEntries(searchParams));
    const deployments = deploymentRepository.findAll({
      status: query.status,
      limit: query.limit,
      offset: query.offset,
    });

    return NextResponse.json({ deployments });
  } catch (err) {
    return serverError((err as Error).message);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = deploymentCreateSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((i) => i.message).join(', '));
    }

    const { projectId, buildId, envVars } = parsed.data;

    const project = projectRepository.findById(projectId);
    if (!project) return notFound('Project not found');

    const build = buildRepository.findById(buildId);
    if (!build) return notFound('Build not found');
    if (build.status !== 'success') {
      return badRequest('Build has not completed successfully');
    }

    const agent = selectAgent('deploy');
    if (!agent) {
      return serverError('No deploy agent available');
    }

    const deploymentId = generateId.deployment();
    const containerName = `${project.name}-${deploymentId.slice(-8)}`;
    const portMappings = JSON.parse(project.port_mappings) as Array<{ host: number; container: number }>;

    const deployment = deploymentRepository.create({
      id: deploymentId,
      projectId,
      buildId,
      deployAgentId: agent.id,
      containerName,
      ports: JSON.stringify(portMappings),
      envVars: JSON.stringify(envVars),
    });

    const imageName = `${build.image_name}:${build.image_tag}`;

    // Fire-and-forget: track in background
    triggerDeployAndTrack(agent.id, {
      deploymentId,
      imageTarPath: `/tmp/${build.image_name}-${build.image_tag}.tar`,
      imageName,
      containerName,
      portMappings,
      envVars,
    });

    return NextResponse.json({ deploymentId: deployment.id, status: deployment.status }, { status: 202 });
  } catch (err) {
    return serverError((err as Error).message);
  }
}
