import { NextRequest, NextResponse } from 'next/server';
import { buildTriggerSchema, listQuerySchema } from '@/lib/validation';
import { projectRepository } from '@/db/repositories/project.repository';
import { buildRepository } from '@/db/repositories/build.repository';
import { generateId } from '@/lib/id';
import { selectAgent, triggerBuildAndTrack } from '@/lib/agent-proxy';
import { badRequest, notFound, serverError } from '@/lib/errors';

type Params = { params: Promise<{ projectId: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { projectId } = await params;
    const project = projectRepository.findById(projectId);
    if (!project) return notFound('Project not found');

    const { searchParams } = request.nextUrl;
    const query = listQuerySchema.parse(Object.fromEntries(searchParams));
    const builds = buildRepository.findByProjectId(projectId, query.limit, query.offset);

    return NextResponse.json({ builds });
  } catch (err) {
    return serverError((err as Error).message);
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { projectId } = await params;
    const project = projectRepository.findById(projectId);
    if (!project) return notFound('Project not found');

    const body = await request.json().catch(() => ({}));
    const parsed = buildTriggerSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((i) => i.message).join(', '));
    }

    const agent = selectAgent('build');
    if (!agent) {
      return serverError('No build agent available');
    }

    const buildId = generateId.build();
    const gitBranch = parsed.data.gitBranch ?? project.git_branch;
    const imageTag = buildId;
    const imageName = project.name;

    const build = buildRepository.create({
      id: buildId,
      projectId,
      buildAgentId: agent.id,
      gitBranch,
      gitCommit: parsed.data.gitCommit,
      imageName,
      imageTag,
    });

    // Fire-and-forget: track in background
    triggerBuildAndTrack(agent.id, {
      buildId,
      gitUrl: project.git_url,
      gitBranch,
      gitCommit: parsed.data.gitCommit,
      dockerfilePath: project.dockerfile_path,
      imageName,
      imageTag,
      buildArgs: JSON.parse(project.build_args),
    });

    return NextResponse.json({ buildId: build.id, status: build.status }, { status: 202 });
  } catch (err) {
    return serverError((err as Error).message);
  }
}
