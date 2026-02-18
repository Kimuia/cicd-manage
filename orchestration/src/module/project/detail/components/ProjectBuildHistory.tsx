import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { TimeAgo } from '@/shared/components/TimeAgo';
import { formatDuration } from '@/shared/utils/format-date';
import { BUILD_STATUS_LABEL, BUILD_STATUS_VARIANT, type BuildApiResponse } from '@/entity/build';
import { EmptyState } from '@/shared/components/EmptyState';
import { Hammer } from 'lucide-react';

interface ProjectBuildHistoryProps {
  builds: BuildApiResponse[];
}

export function ProjectBuildHistory({ builds }: ProjectBuildHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 빌드</CardTitle>
      </CardHeader>
      <CardContent>
        {builds.length === 0 ? (
          <EmptyState icon={Hammer} title="빌드 기록이 없습니다" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>브랜치</TableHead>
                <TableHead>소요시간</TableHead>
                <TableHead>생성일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {builds.map((build) => (
                <TableRow key={build.id}>
                  <TableCell>
                    <Link href={`/builds/${build.id}`} className="font-mono text-xs hover:underline">
                      {build.id.slice(-8)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      label={BUILD_STATUS_LABEL[build.status]}
                      variant={BUILD_STATUS_VARIANT[build.status]}
                    />
                  </TableCell>
                  <TableCell className="text-sm">{build.git_branch ?? '-'}</TableCell>
                  <TableCell className="text-sm">{formatDuration(build.started_at, build.completed_at)}</TableCell>
                  <TableCell><TimeAgo date={build.created_at} className="text-sm" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
