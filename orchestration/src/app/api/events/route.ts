import { eventBus } from '@/lib/event-bus';

export const dynamic = 'force-dynamic';

export async function GET() {
  let unsubscribe: (() => void) | null = null;
  let keepalive: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      unsubscribe = eventBus.subscribe((event) => {
        const payload = `event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`;
        controller.enqueue(encoder.encode(payload));
      });

      keepalive = setInterval(() => {
        controller.enqueue(encoder.encode(': keepalive\n\n'));
      }, 30_000);
    },
    cancel() {
      unsubscribe?.();
      if (keepalive) clearInterval(keepalive);
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
