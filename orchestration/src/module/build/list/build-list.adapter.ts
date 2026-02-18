import type { BuildApiResponse } from '@/entity/build';
import { formatDuration } from '@/shared/utils/format-date';
import type { BuildListView } from './build-list.type';

export const buildListAdapter = {
  toUI(api: BuildApiResponse): BuildListView {
    return {
      id: api.id,
      projectId: api.project_id,
      status: api.status,
      gitBranch: api.git_branch,
      gitCommit: api.git_commit,
      imageName: api.image_name,
      duration: formatDuration(api.started_at, api.completed_at),
      createdAt: api.created_at,
    };
  },

  toUIList(apiList: BuildApiResponse[]): BuildListView[] {
    return apiList.map(this.toUI);
  },
};
