'use client';

import { useState, useCallback } from 'react';
import { useSSE } from '@/shared/hooks/useSSE';
import type { SSEEvent } from '@/shared/hooks/useSSE';
import type { BuildStatus } from '@/entity/build';

interface BuildProgress {
  status: BuildStatus;
  step?: string;
  logs: string[];
}

export function useBuildProgress(buildId: string, isActive: boolean) {
  const [progress, setProgress] = useState<BuildProgress>({
    status: 'running',
    logs: [],
  });

  const handleEvent = useCallback((event: SSEEvent) => {
    const data = event.data;
    if (data.type === 'log' && typeof data.message === 'string') {
      setProgress((prev) => ({
        ...prev,
        logs: [...prev.logs, data.message as string],
      }));
    } else if (data.type === 'status') {
      setProgress((prev) => ({
        ...prev,
        status: data.status as BuildStatus,
        step: data.step as string | undefined,
      }));
    } else if (data.type === 'complete' || data.type === 'error') {
      setProgress((prev) => ({
        ...prev,
        status: (data.status as BuildStatus) ?? (data.type === 'error' ? 'failed' : 'success'),
      }));
    }
  }, []);

  const { isConnected, error } = useSSE({
    url: isActive ? `/api/builds/${buildId}/progress` : null,
    onEvent: handleEvent,
  });

  return { progress, isConnected, error };
}
