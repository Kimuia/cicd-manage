import type { DeploymentApiResponse } from '@/entity/deployment';
import type { DeploymentDetailView } from './deployment-detail.type';

function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

export const deploymentDetailAdapter = {
  toUI(api: DeploymentApiResponse): DeploymentDetailView {
    return {
      id: api.id,
      projectId: api.project_id,
      buildId: api.build_id,
      deployAgentId: api.deploy_agent_id,
      status: api.status,
      containerId: api.container_id,
      containerName: api.container_name,
      ports: safeJsonParse<Array<{ host: number; container: number }>>(api.ports, []),
      envVars: safeJsonParse<Record<string, string>>(api.env_vars, {}),
      startedAt: api.started_at,
      stoppedAt: api.stopped_at,
      errorMessage: api.error_message,
      createdAt: api.created_at,
      isActive: api.status === 'pending' || api.status === 'deploying',
    };
  },
};
