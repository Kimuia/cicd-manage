import { Hammer } from 'lucide-react';
import { PageHeader } from '@/shared/components/PageHeader';
import { EmptyState } from '@/shared/components/EmptyState';
import { getBuildList, BuildTable } from '@/module/build/list';

export default async function BuildsPage() {
  const builds = await getBuildList();

  return (
    <div className="space-y-6">
      <PageHeader title="빌드" description="전체 빌드 목록" />

      {builds.length === 0 ? (
        <EmptyState icon={Hammer} title="빌드 기록이 없습니다" description="프로젝트에서 빌드를 시작하세요." />
      ) : (
        <BuildTable builds={builds} />
      )}
    </div>
  );
}
