'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export interface SSEEvent {
  type: string;
  data: Record<string, unknown>;
}

interface UseSSEOptions {
  url: string | null;
  onEvent?: (event: SSEEvent) => void;
}

export function useSSE({ url, onEvent }: UseSSEOptions) {
  const [events, setEvents] = useState<SSEEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const close = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    if (!url) return;

    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    es.onmessage = (e) => {
      try {
        const parsed: SSEEvent = JSON.parse(e.data);
        setEvents((prev) => [...prev, parsed]);
        onEventRef.current?.(parsed);
      } catch {
        // non-JSON message, wrap it
        const wrapped: SSEEvent = { type: 'message', data: { raw: e.data } };
        setEvents((prev) => [...prev, wrapped]);
        onEventRef.current?.(wrapped);
      }
    };

    es.onerror = () => {
      setError('SSE connection error');
      setIsConnected(false);
      es.close();
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    };
  }, [url]);

  const reset = useCallback(() => setEvents([]), []);

  return { events, isConnected, error, close, reset };
}
