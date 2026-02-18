import type { ContainerApiResponse } from '@/entity/container';
import type { ContainerDetailView } from './container-detail.type';

function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

export const containerDetailAdapter = {
  toUI(api: ContainerApiResponse): ContainerDetailView {
    return {
      id: api.id,
      deploymentId: api.deployment_id,
      projectId: api.project_id,
      agentId: api.agent_id,
      name: api.name,
      image: api.image,
      status: api.status,
      health: api.health,
      ports: safeJsonParse<Array<{ host: number; container: number }>>(api.ports, []),
      exitCode: api.exit_code,
      restartCount: api.restart_count,
      startedAt: api.started_at,
      finishedAt: api.finished_at,
      createdAt: api.created_at,
    };
  },
};
