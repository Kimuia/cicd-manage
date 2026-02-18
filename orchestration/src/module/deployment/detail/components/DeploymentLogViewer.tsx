'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogTerminal } from '@/shared/components/LogTerminal';
import { useDeploymentProgress } from '../hooks/useDeploymentProgress';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { DEPLOYMENT_STATUS_LABEL, DEPLOYMENT_STATUS_VARIANT } from '@/entity/deployment';

interface DeploymentLogViewerProps {
  deploymentId: string;
  isActive: boolean;
}

export function DeploymentLogViewer({ deploymentId, isActive }: DeploymentLogViewerProps) {
  const { progress, isConnected } = useDeploymentProgress(deploymentId, isActive);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>배포 로그</CardTitle>
        {isActive && (
          <div className="flex items-center gap-2">
            <StatusBadge
              label={DEPLOYMENT_STATUS_LABEL[progress.status]}
              variant={DEPLOYMENT_STATUS_VARIANT[progress.status]}
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
        <LogTerminal logs={progress.logs} autoScroll={isActive} className="h-64" />
      </CardContent>
    </Card>
  );
}
