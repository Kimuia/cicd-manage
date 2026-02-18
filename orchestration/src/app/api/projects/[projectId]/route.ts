import { NextRequest, NextResponse } from 'next/server';
import { projectUpdateSchema } from '@/lib/validation';
import { projectRepository } from '@/db/repositories/project.repository';
import { badRequest, conflict, notFound, serverError } from '@/lib/errors';

type Params = { params: Promise<{ projectId: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { projectId } = await params;
    const project = projectRepository.findById(projectId);

    if (!project) {
      return notFound('Project not found');
    }

    return NextResponse.json(project);
  } catch (err) {
    return serverError((err as Error).message);
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { projectId } = await params;
    const body = await request.json();
    const parsed = projectUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((i) => i.message).join(', '));
    }

    if (parsed.data.name) {
      const existing = projectRepository.findByName(parsed.data.name);
      if (existing && existing.id !== projectId) {
        return conflict(`Project name "${parsed.data.name}" already exists`);
      }
    }

    const project = projectRepository.update(projectId, parsed.data);

    if (!project) {
      return notFound('Project not found');
    }

    return NextResponse.json(project);
  } catch (err) {
    return serverError((err as Error).message);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { projectId } = await params;
    const deleted = projectRepository.delete(projectId);

    if (!deleted) {
      return notFound('Project not found');
    }

    return NextResponse.json({ message: 'Project deleted' });
  } catch (err) {
    return serverError((err as Error).message);
  }
}
