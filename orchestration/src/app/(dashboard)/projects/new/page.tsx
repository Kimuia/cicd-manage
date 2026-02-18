import { PageHeader } from '@/shared/components/PageHeader';
import { ProjectForm } from '@/module/project/form';

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="새 프로젝트" description="프로젝트 정보를 입력하세요." />
      <ProjectForm mode="create" />
    </div>
  );
}
