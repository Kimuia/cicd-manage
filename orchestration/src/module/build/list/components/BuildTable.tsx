import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { TimeAgo } from '@/shared/components/TimeAgo';
import { BUILD_STATUS_LABEL, BUILD_STATUS_VARIANT } from '@/entity/build';
import type { BuildListView } from '../build-list.type';

interface BuildTableProps {
  builds: BuildListView[];
}

export function BuildTable({ builds }: BuildTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>빌드 ID</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>브랜치</TableHead>
          <TableHead>이미지</TableHead>
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
            <TableCell className="text-sm">{build.gitBranch ?? '-'}</TableCell>
            <TableCell className="font-mono text-xs">{build.imageName ?? '-'}</TableCell>
            <TableCell className="text-sm">{build.duration}</TableCell>
            <TableCell><TimeAgo date={build.createdAt} className="text-sm" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
