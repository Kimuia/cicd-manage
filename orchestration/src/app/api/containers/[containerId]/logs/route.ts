import { NextRequest } from 'next/server';
import { containerRepository } from '@/db/repositories/container.repository';
import { agentRepository } from '@/db/repositories/agent.repository';
import { getAgentUrl } from '@/lib/agent-proxy';
import { notFound, serverError } from '@/lib/errors';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ containerId: string }> }) {
  const { containerId } = await params;
  const container = containerRepository.findById(containerId);
  if (!container) return notFound('Container not found');

  if (!container.agent_id) {
    return serverError('No agent associated with this container');
  }

  const agent = agentRepository.findById(container.agent_id);
  if (!agent) {
    return serverError('Agent not found');
  }

  const { searchParams } = request.nextUrl;
  const tail = searchParams.get('tail') ?? '100';
  const follow = searchParams.get('follow') ?? 'true';

  const url = getAgentUrl(agent);
  const res = await fetch(`${url}/containers/${containerId}/logs?tail=${tail}&follow=${follow}`);

  if (!res.ok || !res.body) {
    return serverError('Failed to stream logs from agent');
  }

  // Pipe the SSE stream directly from deploy-server
  return new Response(res.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
