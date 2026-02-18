import { fetchApi } from '@/shared/lib/fetcher';
import { BUILD_TAGS } from './build.constant';
import type { BuildApiResponse, BuildListResponse, BuildTriggerRequest } from './build.schema';
import type { ListQuery } from '@/shared/model/api';

export const buildService = {
  getList: (query?: ListQuery) =>
    fetchApi<BuildListResponse>('/api/builds', {
      params: query,
      cache: 'no-store',
      tags: BUILD_TAGS.list,
    }),

  getById: (id: string) =>
    fetchApi<BuildApiResponse>(`/api/builds/${id}`, {
      cache: 'no-store',
      tags: BUILD_TAGS.all(id),
    }),

  getByProjectId: (projectId: string, query?: ListQuery) =>
    fetchApi<BuildListResponse>(`/api/projects/${projectId}/builds`, {
      params: query,
      cache: 'no-store',
    }),

  trigger: (projectId: string, data?: BuildTriggerRequest) =>
    fetchApi<{ buildId: string; status: string }>(`/api/projects/${projectId}/builds`, {
      method: 'POST',
      body: data ?? {},
    }),

  cancel: (id: string) =>
    fetchApi<{ message: string }>(`/api/builds/${id}`, {
      method: 'DELETE',
    }),
};
