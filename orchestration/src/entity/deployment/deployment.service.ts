import { fetchApi } from '@/shared/lib/fetcher';
import { DEPLOYMENT_TAGS } from './deployment.constant';
import type { DeploymentApiResponse, DeploymentCreateRequest, DeploymentListResponse } from './deployment.schema';
import type { ListQuery } from '@/shared/model/api';

export const deploymentService = {
  getList: (query?: ListQuery) =>
    fetchApi<DeploymentListResponse>('/api/deployments', {
      params: query,
      cache: 'no-store',
      tags: DEPLOYMENT_TAGS.list,
    }),

  getById: (id: string) =>
    fetchApi<DeploymentApiResponse>(`/api/deployments/${id}`, {
      cache: 'no-store',
      tags: DEPLOYMENT_TAGS.all(id),
    }),

  getByProjectId: (projectId: string, query?: ListQuery) =>
    fetchApi<DeploymentListResponse>(`/api/projects/${projectId}/deployments`, {
      params: query,
      cache: 'no-store',
    }),

  create: (data: DeploymentCreateRequest) =>
    fetchApi<{ deploymentId: string; status: string }>('/api/deployments', {
      method: 'POST',
      body: data,
    }),
};
