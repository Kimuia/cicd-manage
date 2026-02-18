import { NextRequest, NextResponse } from 'next/server';
import { agentRepository } from '@/db/repositories/agent.repository';
import { eventBus } from '@/lib/event-bus';
import { notFound, serverError } from '@/lib/errors';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> },
) {
  try {
    const { agentId } = await params;
    const agent = agentRepository.findById(agentId);

    if (!agent) {
      return notFound('Agent not found');
    }

    return NextResponse.json(agent);
  } catch (err) {
    return serverError((err as Error).message);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> },
) {
  try {
    const { agentId } = await params;
    const agent = agentRepository.findById(agentId);

    if (!agent) {
      return notFound('Agent not found');
    }

    agentRepository.delete(agentId);
    eventBus.emit('agent:offline', { agentId, agentType: agent.type });

    return NextResponse.json({ message: 'Agent deleted' });
  } catch (err) {
    return serverError((err as Error).message);
  }
}
