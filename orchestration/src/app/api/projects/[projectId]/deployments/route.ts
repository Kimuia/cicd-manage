import { NextRequest, NextResponse } from 'next/server';
import { listQuerySchema } from '@/lib/validation';
import { projectRepository } from '@/db/repositories/project.repository';
import { deploymentRepository } from '@/db/repositories/deployment.repository';
import { notFound, serverError } from '@/lib/errors';

export async function GET(request: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await params;
    const project = projectRepository.findById(projectId);
    if (!project) return notFound('Project not found');

    const { searchParams } = request.nextUrl;
    const query = listQuerySchema.parse(Object.fromEntries(searchParams));
    const deployments = deploymentRepository.findByProjectId(projectId, query.limit, query.offset);

    return NextResponse.json({ deployments });
  } catch (err) {
    return serverError((err as Error).message);
  }
}
