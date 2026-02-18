import { NextRequest, NextResponse } from 'next/server';
import { containerRepository } from '@/db/repositories/container.repository';
import { agentRepository } from '@/db/repositories/agent.repository';
import { getAgentUrl } from '@/lib/agent-proxy';
import { eventBus } from '@/lib/event-bus';
import { notFound, serverError } from '@/lib/errors';

type Params = { params: Promise<{ containerId: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { containerId } = await params;
    const container = containerRepository.findById(containerId);
    if (!container) return notFound('Container not found');

    return NextResponse.json(container);
  } catch (err) {
    return serverError((err as Error).message);
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { containerId } = await params;
    const container = containerRepository.findById(containerId);
    if (!container) return notFound('Container not found');

    const force = request.nextUrl.searchParams.get('force') === 'true';

    if (container.agent_id) {
      const agent = agentRepository.findById(container.agent_id);
      if (agent) {
        const url = getAgentUrl(agent);
        const res = await fetch(`${url}/containers/${containerId}?force=${force}`, { method: 'DELETE' });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: { message: 'Unknown error' } }));
          return serverError(err.error?.message ?? 'Failed to delete container');
        }
      }
    }

    containerRepository.delete(containerId);
    eventBus.emit('container:removed', { containerId });

    return NextResponse.json({ message: 'Container deleted' });
  } catch (err) {
    return serverError((err as Error).message);
  }
}
