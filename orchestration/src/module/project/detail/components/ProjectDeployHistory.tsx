import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { TimeAgo } from '@/shared/components/TimeAgo';
import { DEPLOYMENT_STATUS_LABEL, DEPLOYMENT_STATUS_VARIANT, type DeploymentApiResponse } from '@/entity/deployment';
import { EmptyState } from '@/shared/components/EmptyState';
import { Rocket } from 'lucide-react';

interface ProjectDeployHistoryProps {
  deployments: DeploymentApiResponse[];
}

export function ProjectDeployHistory({ deployments }: ProjectDeployHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 배포</CardTitle>
      </CardHeader>
      <CardContent>
        {deployments.length === 0 ? (
          <EmptyState icon={Rocket} title="배포 기록이 없습니다" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>상태</TableHead>
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
                  <TableCell className="font-mono text-xs">{deploy.container_name ?? '-'}</TableCell>
                  <TableCell><TimeAgo date={deploy.created_at} className="text-sm" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
