import { projectService } from '@/entity/project';
import { buildService } from '@/entity/build';
import { deploymentService } from '@/entity/deployment';
import { projectDetailAdapter } from './project-detail.adapter';
import type { ProjectDetailView } from './project-detail.type';

export async function getProjectDetail(projectId: string): Promise<ProjectDetailView> {
  const [project, buildsRes, deploymentsRes] = await Promise.all([
    projectService.getById(projectId),
    buildService.getByProjectId(projectId, { limit: 10 }),
    deploymentService.getByProjectId(projectId, { limit: 10 }),
  ]);

  return projectDetailAdapter.toUI(project, buildsRes.builds, deploymentsRes.deployments);
}
