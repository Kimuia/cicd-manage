import type { BuildStatus } from '@/entity/build';

export interface BuildListView {
  id: string;
  projectId: string;
  status: BuildStatus;
  gitBranch: string | null;
  gitCommit: string | null;
  imageName: string | null;
  duration: string;
  createdAt: string;
}
