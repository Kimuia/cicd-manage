import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { formatDateTime } from '@/shared/utils/format-date';
import { DEPLOYMENT_STATUS_LABEL, DEPLOYMENT_STATUS_VARIANT } from '@/entity/deployment';
import type { DeploymentDetailView } from '../deployment-detail.type';

interface DeploymentInfoProps {
  deployment: DeploymentDetailView;
}

export function DeploymentInfo({ deployment }: DeploymentInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span>배포 정보</span>
          <StatusBadge
            label={DEPLOYMENT_STATUS_LABEL[deployment.status]}
            variant={DEPLOYMENT_STATUS_VARIANT[deployment.status]}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">프로젝트</p>
            <Link href={`/projects/${deployment.projectId}`} className="font-mono text-xs hover:underline">
              {deployment.projectId.slice(-8)}
            </Link>
          </div>
          <div>
            <p className="text-muted-foreground">빌드</p>
            <Link href={`/builds/${deployment.buildId}`} className="font-mono text-xs hover:underline">
              {deployment.buildId.slice(-8)}
            </Link>
          </div>
          <div>
            <p className="text-muted-foreground">컨테이너</p>
            <p className="font-mono text-xs">
              {deployment.containerId ? (
                <Link href={`/containers/${deployment.containerId}`} className="hover:underline">
                  {deployment.containerName ?? deployment.containerId.slice(-8)}
                </Link>
              ) : '-'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">생성일</p>
            <p>{formatDateTime(deployment.createdAt)}</p>
          </div>
          {deployment.ports.length > 0 && (
            <div>
              <p className="text-muted-foreground">포트</p>
              <div className="flex flex-wrap gap-1">
                {deployment.ports.map((pm, i) => (
                  <span key={i} className="rounded bg-muted px-2 py-0.5 font-mono text-xs">
                    {pm.host}:{pm.container}
                  </span>
                ))}
              </div>
            </div>
          )}
          {deployment.errorMessage && (
            <div className="col-span-2">
              <p className="text-muted-foreground">에러</p>
              <p className="text-sm text-destructive">{deployment.errorMessage}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
