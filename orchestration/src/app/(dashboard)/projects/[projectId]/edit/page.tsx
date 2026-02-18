import { notFound } from 'next/navigation';
import { PageHeader } from '@/shared/components/PageHeader';
import { ProjectForm } from '@/module/project/form';
import { projectFormAdapter } from '@/module/project/form';
import { projectService } from '@/entity/project';
import { ApiError } from '@/shared/lib/fetcher';

interface Props {
  params: Promise<{ projectId: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const { projectId } = await params;

  let project;
  try {
    project = await projectService.getById(projectId);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const defaultValues = projectFormAdapter.toFormView(project);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="프로젝트 수정" description={project.name} />
      <ProjectForm mode="edit" projectId={projectId} defaultValues={defaultValues} />
    </div>
  );
}
