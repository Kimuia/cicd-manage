import { notFound } from 'next/navigation';
import { PageHeader } from '@/shared/components/PageHeader';
import { getDeploymentDetail, DeploymentInfo, DeploymentLogViewer } from '@/module/deployment/detail';
import { ApiError } from '@/shared/lib/fetcher';

interface Props {
  params: Promise<{ deploymentId: string }>;
}

export default async function DeploymentDetailPage({ params }: Props) {
  const { deploymentId } = await params;

  let deployment;
  try {
    deployment = await getDeploymentDetail(deploymentId);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <div className="space-y-6">
      <PageHeader title={`배포 ${deployment.id.slice(-8)}`} />
      <DeploymentInfo deployment={deployment} />
      <DeploymentLogViewer deploymentId={deployment.id} isActive={deployment.isActive} />
    </div>
  );
}
