import { notFound } from 'next/navigation';
import { PageHeader } from '@/shared/components/PageHeader';
import { getBuildDetail, BuildInfo, BuildLogViewer } from '@/module/build/detail';
import { ApiError } from '@/shared/lib/fetcher';

interface Props {
  params: Promise<{ buildId: string }>;
}

export default async function BuildDetailPage({ params }: Props) {
  const { buildId } = await params;

  let build;
  try {
    build = await getBuildDetail(buildId);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <div className="space-y-6">
      <PageHeader title={`빌드 ${build.id.slice(-8)}`} />
      <BuildInfo build={build} />
      <BuildLogViewer buildId={build.id} initialLogs={build.logs} isActive={build.isActive} />
    </div>
  );
}
