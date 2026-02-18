import type { DeploymentStatus } from '@/entity/deployment';

export interface DeploymentListView {
  id: string;
  projectId: string;
  buildId: string;
  status: DeploymentStatus;
  containerName: string | null;
  createdAt: string;
}
