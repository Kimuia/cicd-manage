import { NextRequest, NextResponse } from 'next/server';
import { deploymentRepository } from '@/db/repositories/deployment.repository';
import { notFound, serverError } from '@/lib/errors';

type Params = { params: Promise<{ deploymentId: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { deploymentId } = await params;
    const deployment = deploymentRepository.findById(deploymentId);
    if (!deployment) return notFound('Deployment not found');

    return NextResponse.json(deployment);
  } catch (err) {
    return serverError((err as Error).message);
  }
}
