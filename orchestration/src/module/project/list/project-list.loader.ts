import { projectService } from '@/entity/project';
import { projectListAdapter } from './project-list.adapter';
import type { ProjectListView } from './project-list.type';

export async function getProjectList(): Promise<ProjectListView[]> {
  const { projects } = await projectService.getList();
  return projectListAdapter.toUIList(projects);
}
