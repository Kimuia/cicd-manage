import Link from 'next/link';
import { Plus, FolderGit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/shared/components/PageHeader';
import { EmptyState } from '@/shared/components/EmptyState';
import { getProjectList, ProjectCard } from '@/module/project/list';

export default async function ProjectsPage() {
  const projects = await getProjectList();

  return (
    <div className="space-y-6">
      <PageHeader title="프로젝트" description="CI/CD 프로젝트 목록">
        <Link href="/projects/new">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            새 프로젝트
          </Button>
        </Link>
      </PageHeader>

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="프로젝트가 없습니다"
          description="새 프로젝트를 생성해서 시작하세요."
        >
          <Link href="/projects/new">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              새 프로젝트
            </Button>
          </Link>
        </EmptyState>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
