'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogTerminal } from '@/shared/components/LogTerminal';
import { useContainerLogs } from '../hooks/useContainerLogs';

interface ContainerLogViewerProps {
  containerId: string;
  isRunning: boolean;
}

export function ContainerLogViewer({ containerId, isRunning }: ContainerLogViewerProps) {
  const [streaming, setStreaming] = useState(isRunning);
  const { logs, isConnected, close, clear } = useContainerLogs(containerId, streaming);

  const handleToggle = () => {
    if (streaming) {
      close();
      setStreaming(false);
    } else {
      clear();
      setStreaming(true);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>컨테이너 로그</CardTitle>
        <div className="flex items-center gap-2">
          {isConnected && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              실시간
            </span>
          )}
          <Button size="sm" variant="outline" onClick={handleToggle}>
            {streaming ? '중지' : '스트리밍 시작'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <LogTerminal logs={logs} autoScroll={streaming} className="h-96" />
      </CardContent>
    </Card>
  );
}
