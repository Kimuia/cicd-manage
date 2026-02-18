import { deploymentService } from '@/entity/deployment';
import { deploymentDetailAdapter } from './deployment-detail.adapter';
import type { DeploymentDetailView } from './deployment-detail.type';

export async function getDeploymentDetail(deploymentId: string): Promise<DeploymentDetailView> {
  const deployment = await deploymentService.getById(deploymentId);
  return deploymentDetailAdapter.toUI(deployment);
}
