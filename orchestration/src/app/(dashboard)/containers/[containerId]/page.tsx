import { notFound } from 'next/navigation';
import { PageHeader } from '@/shared/components/PageHeader';
import { getContainerDetail, ContainerInfo, ContainerActions, ContainerLogViewer } from '@/module/container/detail';
import { ApiError } from '@/shared/lib/fetcher';

interface Props {
  params: Promise<{ containerId: string }>;
}

export default async function ContainerDetailPage({ params }: Props) {
  const { containerId } = await params;

  let container;
  try {
    container = await getContainerDetail(containerId);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <div className="space-y-6">
      <PageHeader title={container.name}>
        <ContainerActions
          containerId={container.id}
          containerName={container.name}
          status={container.status}
        />
      </PageHeader>
      <ContainerInfo container={container} />
      <ContainerLogViewer containerId={container.id} isRunning={container.status === 'running'} />
    </div>
  );
}
