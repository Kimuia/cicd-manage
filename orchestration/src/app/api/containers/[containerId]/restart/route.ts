import { NextRequest, NextResponse } from 'next/server';
import { containerRepository } from '@/db/repositories/container.repository';
import { agentRepository } from '@/db/repositories/agent.repository';
import { getAgentUrl } from '@/lib/agent-proxy';
import { notFound, serverError } from '@/lib/errors';

export async function POST(_request: NextRequest, { params }: { params: Promise<{ containerId: string }> }) {
  try {
    const { containerId } = await params;
    const container = containerRepository.findById(containerId);
    if (!container) return notFound('Container not found');

    if (container.agent_id) {
      const agent = agentRepository.findById(container.agent_id);
      if (agent) {
        const url = getAgentUrl(agent);
        const res = await fetch(`${url}/containers/${containerId}/restart`, { method: 'POST' });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: { message: 'Unknown error' } }));
          return serverError(err.error?.message ?? 'Failed to restart container');
        }
      }
    }

    containerRepository.updateStatus(containerId, 'running');

    return NextResponse.json({ status: 'restarted', containerId });
  } catch (err) {
    return serverError((err as Error).message);
  }
}
