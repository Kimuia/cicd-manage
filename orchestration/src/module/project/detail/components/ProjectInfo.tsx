import { GitBranch, FileCode, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatDateTime } from '@/shared/utils/format-date';
import type { ProjectDetailView } from '../project-detail.type';

interface ProjectInfoProps {
  project: ProjectDetailView;
}

export function ProjectInfo({ project }: ProjectInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>프로젝트 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {project.description && (
          <p className="text-sm text-muted-foreground">{project.description}</p>
        )}
        <Separator />
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">Git URL</p>
            <p className="font-mono text-xs break-all">{project.gitUrl}</p>
          </div>
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-muted-foreground" />
            <span>{project.gitBranch}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileCode className="h-4 w-4 text-muted-foreground" />
            <span>{project.dockerfilePath}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDateTime(project.createdAt)}</span>
          </div>
        </div>
        {project.portMappings.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="mb-2 text-sm text-muted-foreground">포트 매핑</p>
              <div className="flex flex-wrap gap-2">
                {project.portMappings.map((pm, i) => (
                  <span key={i} className="rounded bg-muted px-2 py-1 font-mono text-xs">
                    {pm.host}:{pm.container}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
