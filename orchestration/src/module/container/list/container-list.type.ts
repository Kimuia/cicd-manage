import type { ContainerStatus, ContainerHealth } from '@/entity/container';

export interface ContainerListView {
  id: string;
  name: string;
  image: string;
  status: ContainerStatus;
  health: ContainerHealth;
  ports: Array<{ host: number; container: number }>;
  restartCount: number;
  createdAt: string;
}
