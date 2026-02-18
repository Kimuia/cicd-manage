import { Rocket } from 'lucide-react';
import { PageHeader } from '@/shared/components/PageHeader';
import { EmptyState } from '@/shared/components/EmptyState';
import { getDeploymentList, DeploymentTable } from '@/module/deployment/list';

export default async function DeploymentsPage() {
  const deployments = await getDeploymentList();

  return (
    <div className="space-y-6">
      <PageHeader title="배포" description="전체 배포 목록" />

      {deployments.length === 0 ? (
        <EmptyState icon={Rocket} title="배포 기록이 없습니다" description="빌드 완료 후 배포를 시작하세요." />
      ) : (
        <DeploymentTable deployments={deployments} />
      )}
    </div>
  );
}
