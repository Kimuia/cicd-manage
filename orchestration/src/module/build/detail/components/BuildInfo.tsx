import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { formatDateTime, formatDuration } from '@/shared/utils/format-date';
import { formatBytes } from '@/shared/utils/format-bytes';
import { BUILD_STATUS_LABEL, BUILD_STATUS_VARIANT } from '@/entity/build';
import type { BuildDetailView } from '../build-detail.type';

interface BuildInfoProps {
  build: BuildDetailView;
}

export function BuildInfo({ build }: BuildInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span>빌드 정보</span>
          <StatusBadge
            label={BUILD_STATUS_LABEL[build.status]}
            variant={BUILD_STATUS_VARIANT[build.status]}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">프로젝트</p>
            <Link href={`/projects/${build.projectId}`} className="font-mono text-xs hover:underline">
              {build.projectId.slice(-8)}
            </Link>
          </div>
          <div>
            <p className="text-muted-foreground">브랜치</p>
            <p>{build.gitBranch ?? '-'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">이미지</p>
            <p className="font-mono text-xs">{build.imageName ? `${build.imageName}:${build.imageTag}` : '-'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">이미지 크기</p>
            <p>{formatBytes(build.imageSize)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">소요시간</p>
            <p>{formatDuration(build.startedAt, build.completedAt)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">생성일</p>
            <p>{formatDateTime(build.createdAt)}</p>
          </div>
          {build.errorMessage && (
            <div className="col-span-2">
              <p className="text-muted-foreground">에러</p>
              <p className="text-sm text-destructive">{build.errorMessage}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
