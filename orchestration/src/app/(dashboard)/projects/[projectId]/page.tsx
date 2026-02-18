import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/shared/components/PageHeader';
import {
  getProjectDetail,
  ProjectInfo,
  ProjectBuildHistory,
  ProjectDeployHistory,
  TriggerBuildButton,
} from '@/module/project/detail';
import { DeleteProjectButton } from './DeleteProjectButton';
import { ApiError } from '@/shared/lib/fetcher';

interface Props {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { projectId } = await params;

  let project;
  try {
    project = await getProjectDetail(projectId);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <div className="space-y-6">
      <PageHeader title={project.name} description={project.description || undefined}>
        <TriggerBuildButton projectId={project.id} />
        <Link href={`/projects/${project.id}/edit`}>
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            수정
          </Button>
        </Link>
        <DeleteProjectButton projectId={project.id} />
      </PageHeader>

      <ProjectInfo project={project} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ProjectBuildHistory builds={project.recentBuilds} />
        <ProjectDeployHistory deployments={project.recentDeployments} />
      </div>
    </div>
  );
}
