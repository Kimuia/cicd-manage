'use client';

import { useState, useCallback } from 'react';
import { useSSE } from '@/shared/hooks/useSSE';
import type { SSEEvent } from '@/shared/hooks/useSSE';
import type { DeploymentStatus } from '@/entity/deployment';

interface DeploymentProgress {
  status: DeploymentStatus;
  step?: string;
  logs: string[];
}

export function useDeploymentProgress(deploymentId: string, isActive: boolean) {
  const [progress, setProgress] = useState<DeploymentProgress>({
    status: 'deploying',
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
        status: data.status as DeploymentStatus,
        step: data.step as string | undefined,
      }));
    } else if (data.type === 'complete' || data.type === 'error') {
      setProgress((prev) => ({
        ...prev,
        status: (data.status as DeploymentStatus) ?? (data.type === 'error' ? 'failed' : 'running'),
      }));
    }
  }, []);

  const { isConnected, error } = useSSE({
    url: isActive ? `/api/deployments/${deploymentId}/progress` : null,
    onEvent: handleEvent,
  });

  return { progress, isConnected, error };
}
