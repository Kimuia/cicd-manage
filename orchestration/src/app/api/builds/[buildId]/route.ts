import { NextRequest, NextResponse } from 'next/server';
import { buildRepository } from '@/db/repositories/build.repository';
import { notFound, serverError } from '@/lib/errors';

type Params = { params: Promise<{ buildId: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { buildId } = await params;
    const build = buildRepository.findById(buildId);
    if (!build) return notFound('Build not found');

    return NextResponse.json(build);
  } catch (err) {
    return serverError((err as Error).message);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { buildId } = await params;
    const build = buildRepository.findById(buildId);
    if (!build) return notFound('Build not found');

    if (build.status === 'running' || build.status === 'queued') {
      buildRepository.updateStatus(buildId, 'cancelled', { completedAt: new Date().toISOString() });
    } else {
      buildRepository.delete(buildId);
    }

    return NextResponse.json({ message: 'Build cancelled' });
  } catch (err) {
    return serverError((err as Error).message);
  }
}
