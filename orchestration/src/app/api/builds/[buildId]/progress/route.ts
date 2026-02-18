import { NextRequest } from 'next/server';
import { buildRepository } from '@/db/repositories/build.repository';
import { eventBus } from '@/lib/event-bus';
import { notFound } from '@/lib/errors';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ buildId: string }> }) {
  const { buildId } = await params;
  const build = buildRepository.findById(buildId);
  if (!build) return notFound('Build not found');

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      const unsubscribe = eventBus.subscribe((evt) => {
        if (evt.data.buildId !== buildId) return;

        if (evt.type === 'build:progress') {
          send('progress', evt.data);
        } else if (evt.type === 'build:completed') {
          send('complete', evt.data);
          cleanup();
        } else if (evt.type === 'build:failed') {
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

      // If build is already terminal, close immediately
      if (['success', 'failed', 'cancelled'].includes(build.status)) {
        send('complete', { buildId, status: build.status });
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
