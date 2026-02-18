import type { DeploymentStatus } from '@/entity/deployment';

export interface DeploymentDetailView {
  id: string;
  projectId: string;
  buildId: string;
  deployAgentId: string | null;
  status: DeploymentStatus;
  containerId: string | null;
  containerName: string | null;
  ports: Array<{ host: number; container: number }>;
  envVars: Record<string, string>;
  startedAt: string | null;
  stoppedAt: string | null;
  errorMessage: string | null;
  createdAt: string;
  isActive: boolean;
}
