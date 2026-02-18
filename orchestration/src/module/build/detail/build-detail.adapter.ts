import type { BuildApiResponse } from '@/entity/build';
import type { BuildDetailView } from './build-detail.type';

export const buildDetailAdapter = {
  toUI(api: BuildApiResponse): BuildDetailView {
    return {
      id: api.id,
      projectId: api.project_id,
      buildAgentId: api.build_agent_id,
      status: api.status,
      gitCommit: api.git_commit,
      gitBranch: api.git_branch,
      imageName: api.image_name,
      imageTag: api.image_tag,
      imageSize: api.image_size,
      startedAt: api.started_at,
      completedAt: api.completed_at,
      errorMessage: api.error_message,
      logs: api.logs ? api.logs.split('\n').filter(Boolean) : [],
      createdAt: api.created_at,
      isActive: api.status === 'running' || api.status === 'queued',
    };
  },
};
