'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogTerminal } from '@/shared/components/LogTerminal';
import { useBuildProgress } from '../hooks/useBuildProgress';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { BUILD_STATUS_LABEL, BUILD_STATUS_VARIANT } from '@/entity/build';

interface BuildLogViewerProps {
  buildId: string;
  initialLogs: string[];
  isActive: boolean;
}

export function BuildLogViewer({ buildId, initialLogs, isActive }: BuildLogViewerProps) {
  const { progress, isConnected } = useBuildProgress(buildId, isActive);

  const allLogs = isActive ? [...initialLogs, ...progress.logs] : initialLogs;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>빌드 로그</CardTitle>
        {isActive && (
          <div className="flex items-center gap-2">
            <StatusBadge
              label={BUILD_STATUS_LABEL[progress.status]}
              variant={BUILD_STATUS_VARIANT[progress.status]}
            />
            {isConnected && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                실시간
              </span>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <LogTerminal logs={allLogs} autoScroll={isActive} className="h-96" />
      </CardContent>
    </Card>
  );
}
