import type { BuildApiResponse } from '@/entity/build';
import type { DeploymentApiResponse } from '@/entity/deployment';

export interface ProjectDetailView {
  id: string;
  name: string;
  description: string;
  gitUrl: string;
  gitBranch: string;
  dockerfilePath: string;
  buildArgs: Record<string, string>;
  envVars: Record<string, string>;
  portMappings: Array<{ host: number; container: number }>;
  createdAt: Date;
  updatedAt: Date;
  recentBuilds: BuildApiResponse[];
  recentDeployments: DeploymentApiResponse[];
}
