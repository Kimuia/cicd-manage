import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { TimeAgo } from '@/shared/components/TimeAgo';
import { DEPLOYMENT_STATUS_LABEL, DEPLOYMENT_STATUS_VARIANT } from '@/entity/deployment';
import type { DeploymentListView } from '../deployment-list.type';

interface DeploymentTableProps {
  deployments: DeploymentListView[];
}

export function DeploymentTable({ deployments }: DeploymentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>배포 ID</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>빌드 ID</TableHead>
          <TableHead>컨테이너</TableHead>
          <TableHead>생성일</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {deployments.map((deploy) => (
          <TableRow key={deploy.id}>
            <TableCell>
              <Link href={`/deployments/${deploy.id}`} className="font-mono text-xs hover:underline">
                {deploy.id.slice(-8)}
              </Link>
            </TableCell>
            <TableCell>
              <StatusBadge
                label={DEPLOYMENT_STATUS_LABEL[deploy.status]}
                variant={DEPLOYMENT_STATUS_VARIANT[deploy.status]}
              />
            </TableCell>
            <TableCell>
              <Link href={`/builds/${deploy.buildId}`} className="font-mono text-xs hover:underline">
                {deploy.buildId.slice(-8)}
              </Link>
            </TableCell>
            <TableCell className="font-mono text-xs">{deploy.containerName ?? '-'}</TableCell>
            <TableCell><TimeAgo date={deploy.createdAt} className="text-sm" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
