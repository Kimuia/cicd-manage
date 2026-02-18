import { NextRequest, NextResponse } from 'next/server';
import { heartbeatSchema } from '@/lib/validation';
import { agentRepository } from '@/db/repositories/agent.repository';
import { badRequest, notFound, serverError } from '@/lib/errors';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> },
) {
  try {
    const { agentId } = await params;
    const body = await request.json();
    const parsed = heartbeatSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((i) => i.message).join(', '));
    }

    const { status, metrics } = parsed.data;
    const updated = agentRepository.updateHeartbeat(agentId, status, metrics);

    if (!updated) {
      return notFound('Agent not found');
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return serverError((err as Error).message);
  }
}
