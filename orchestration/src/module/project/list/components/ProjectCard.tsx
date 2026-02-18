import Link from 'next/link';
import { GitBranch, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TimeAgo } from '@/shared/components/TimeAgo';
import type { ProjectListView } from '../project-list.type';

interface ProjectCardProps {
  project: ProjectListView;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="transition-colors hover:border-foreground/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{project.name}</CardTitle>
          {project.description && (
            <CardDescription className="line-clamp-2">{project.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              {project.gitBranch}
            </span>
            <span className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              {project.gitUrl.replace(/^https?:\/\//, '').slice(0, 30)}
            </span>
            <span className="ml-auto">
              <TimeAgo date={project.updatedAt.toISOString()} />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
