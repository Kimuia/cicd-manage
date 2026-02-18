import { NextRequest } from 'next/server';
import { deploymentRepository } from '@/db/repositories/deployment.repository';
import { eventBus } from '@/lib/event-bus';
import { notFound } from '@/lib/errors';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ deploymentId: string }> }) {
  const { deploymentId } = await params;
  const deployment = deploymentRepository.findById(deploymentId);
  if (!deployment) return notFound('Deployment not found');

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      const unsubscribe = eventBus.subscribe((evt) => {
        if (evt.data.deploymentId !== deploymentId) return;

        if (evt.type === 'deployment:progress') {
          send('progress', evt.data);
        } else if (evt.type === 'deployment:completed') {
          send('complete', evt.data);
          cleanup();
        } else if (evt.type === 'deployment:failed') {
          send('error', evt.data);
          cleanup();
        }
      });

      const keepalive = setInterval(() => {
        controller.enqueue(encoder.encode(': keepalive\n\n'));
      }, 30_000);

      function cleanup() {
        unsubscribe();
        clearInterval(keepalive);
        controller.close();
      }

      if (['running', 'stopped', 'failed'].includes(deployment.status)) {
        send('complete', { deploymentId, status: deployment.status });
        cleanup();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
