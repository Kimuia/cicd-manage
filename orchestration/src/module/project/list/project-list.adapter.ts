import type { ProjectApiResponse } from '@/entity/project';
import type { ProjectListView } from './project-list.type';

export const projectListAdapter = {
  toUI(api: ProjectApiResponse): ProjectListView {
    return {
      id: api.id,
      name: api.name,
      description: api.description,
      gitUrl: api.git_url,
      gitBranch: api.git_branch,
      createdAt: new Date(api.created_at),
      updatedAt: new Date(api.updated_at),
    };
  },

  toUIList(apiList: ProjectApiResponse[]): ProjectListView[] {
    return apiList.map(this.toUI);
  },
};
