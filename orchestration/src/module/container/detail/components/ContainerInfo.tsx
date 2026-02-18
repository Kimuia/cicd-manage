import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { formatDateTime } from '@/shared/utils/format-date';
import { CONTAINER_STATUS_LABEL, CONTAINER_STATUS_VARIANT, CONTAINER_HEALTH_LABEL } from '@/entity/container';
import type { ContainerDetailView } from '../container-detail.type';

interface ContainerInfoProps {
  container: ContainerDetailView;
}

export function ContainerInfo({ container }: ContainerInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span>컨테이너 정보</span>
          <StatusBadge
            label={CONTAINER_STATUS_LABEL[container.status]}
            variant={CONTAINER_STATUS_VARIANT[container.status]}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">이름</p>
            <p className="font-medium">{container.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">이미지</p>
            <p className="font-mono text-xs">{container.image}</p>
          </div>
          <div>
            <p className="text-muted-foreground">헬스</p>
            <p>{CONTAINER_HEALTH_LABEL[container.health]}</p>
          </div>
          <div>
            <p className="text-muted-foreground">재시작 횟수</p>
            <p>{container.restartCount}</p>
          </div>
          {container.ports.length > 0 && (
            <div>
              <p className="text-muted-foreground">포트</p>
              <div className="flex flex-wrap gap-1">
                {container.ports.map((p, i) => (
                  <span key={i} className="rounded bg-muted px-2 py-0.5 font-mono text-xs">
                    {p.host}:{p.container}
                  </span>
                ))}
              </div>
            </div>
          )}
          {container.deploymentId && (
            <div>
              <p className="text-muted-foreground">배포</p>
              <Link href={`/deployments/${container.deploymentId}`} className="font-mono text-xs hover:underline">
                {container.deploymentId.slice(-8)}
              </Link>
            </div>
          )}
          <div>
            <p className="text-muted-foreground">시작일</p>
            <p>{container.startedAt ? formatDateTime(container.startedAt) : '-'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">생성일</p>
            <p>{formatDateTime(container.createdAt)}</p>
          </div>
          {container.exitCode !== null && (
            <div>
              <p className="text-muted-foreground">종료 코드</p>
              <p>{container.exitCode}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
