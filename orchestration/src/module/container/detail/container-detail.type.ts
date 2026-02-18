import type { ContainerStatus, ContainerHealth } from '@/entity/container';

export interface ContainerDetailView {
  id: string;
  deploymentId: string | null;
  projectId: string | null;
  agentId: string | null;
  name: string;
  image: string;
  status: ContainerStatus;
  health: ContainerHealth;
  ports: Array<{ host: number; container: number }>;
  exitCode: number | null;
  restartCount: number;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
}
