import type { DeploymentApiResponse } from '@/entity/deployment';
import type { DeploymentListView } from './deployment-list.type';

export const deploymentListAdapter = {
  toUI(api: DeploymentApiResponse): DeploymentListView {
    return {
      id: api.id,
      projectId: api.project_id,
      buildId: api.build_id,
      status: api.status,
      containerName: api.container_name,
      createdAt: api.created_at,
    };
  },

  toUIList(apiList: DeploymentApiResponse[]): DeploymentListView[] {
    return apiList.map(this.toUI);
  },
};
