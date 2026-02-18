import type { ProjectApiResponse } from '@/entity/project';
import type { BuildApiResponse } from '@/entity/build';
import type { DeploymentApiResponse } from '@/entity/deployment';
import type { ProjectDetailView } from './project-detail.type';

function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

export const projectDetailAdapter = {
  toUI(
    api: ProjectApiResponse,
    builds: BuildApiResponse[],
    deployments: DeploymentApiResponse[],
  ): ProjectDetailView {
    return {
      id: api.id,
      name: api.name,
      description: api.description,
      gitUrl: api.git_url,
      gitBranch: api.git_branch,
      dockerfilePath: api.dockerfile_path,
      buildArgs: safeJsonParse<Record<string, string>>(api.build_args, {}),
      envVars: safeJsonParse<Record<string, string>>(api.env_vars, {}),
      portMappings: safeJsonParse<Array<{ host: number; container: number }>>(api.port_mappings, []),
      createdAt: new Date(api.created_at),
      updatedAt: new Date(api.updated_at),
      recentBuilds: builds,
      recentDeployments: deployments,
    };
  },
};
