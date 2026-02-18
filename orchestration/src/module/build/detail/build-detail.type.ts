import type { BuildStatus } from '@/entity/build';

export interface BuildDetailView {
  id: string;
  projectId: string;
  buildAgentId: string | null;
  status: BuildStatus;
  gitCommit: string | null;
  gitBranch: string | null;
  imageName: string | null;
  imageTag: string | null;
  imageSize: number | null;
  startedAt: string | null;
  completedAt: string | null;
  errorMessage: string | null;
  logs: string[];
  createdAt: string;
  isActive: boolean;
}
