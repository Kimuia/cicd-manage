import { Container } from 'lucide-react';
import { PageHeader } from '@/shared/components/PageHeader';
import { EmptyState } from '@/shared/components/EmptyState';
import { getContainerList, ContainerTable } from '@/module/container/list';

export default async function ContainersPage() {
  const containers = await getContainerList();

  return (
    <div className="space-y-6">
      <PageHeader title="컨테이너" description="전체 컨테이너 목록" />

      {containers.length === 0 ? (
        <EmptyState icon={Container} title="컨테이너가 없습니다" description="배포를 실행하면 컨테이너가 생성됩니다." />
      ) : (
        <ContainerTable containers={containers} />
      )}
    </div>
  );
}
