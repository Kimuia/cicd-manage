import { deploymentService } from '@/entity/deployment';
import { deploymentListAdapter } from './deployment-list.adapter';
import type { DeploymentListView } from './deployment-list.type';

export async function getDeploymentList(): Promise<DeploymentListView[]> {
  const { deployments } = await deploymentService.getList({ limit: 50 });
  return deploymentListAdapter.toUIList(deployments);
}
