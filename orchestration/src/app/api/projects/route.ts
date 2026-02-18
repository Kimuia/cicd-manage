import { NextRequest, NextResponse } from 'next/server';
import { projectCreateSchema, listQuerySchema } from '@/lib/validation';
import { projectRepository } from '@/db/repositories/project.repository';
import { generateId } from '@/lib/id';
import { badRequest, conflict, serverError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = listQuerySchema.parse(Object.fromEntries(searchParams));
    const projects = projectRepository.findAll(query.limit, query.offset);
    return NextResponse.json({ projects });
  } catch (err) {
    return serverError((err as Error).message);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = projectCreateSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((i) => i.message).join(', '));
    }

    const existing = projectRepository.findByName(parsed.data.name);
    if (existing) {
      return conflict(`Project name "${parsed.data.name}" already exists`);
    }

    const project = projectRepository.create({
      id: generateId.project(),
      ...parsed.data,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    return serverError((err as Error).message);
  }
}
