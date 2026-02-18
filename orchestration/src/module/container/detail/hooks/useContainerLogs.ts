'use client';

import { useState, useCallback } from 'react';
import { useSSE } from '@/shared/hooks/useSSE';
import type { SSEEvent } from '@/shared/hooks/useSSE';

export function useContainerLogs(containerId: string, enabled: boolean) {
  const [logs, setLogs] = useState<string[]>([]);

  const handleEvent = useCallback((event: SSEEvent) => {
    const data = event.data;
    if (typeof data.log === 'string') {
      setLogs((prev) => [...prev, data.log as string]);
    } else if (typeof data.raw === 'string') {
      setLogs((prev) => [...prev, data.raw as string]);
    }
  }, []);

  const { isConnected, error, close } = useSSE({
    url: enabled ? `/api/containers/${containerId}/logs` : null,
    onEvent: handleEvent,
  });

  const clear = useCallback(() => setLogs([]), []);

  return { logs, isConnected, error, close, clear };
}
