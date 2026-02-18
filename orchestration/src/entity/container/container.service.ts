import { fetchApi } from '@/shared/lib/fetcher';
import { CONTAINER_TAGS } from './container.constant';
import type { ContainerApiResponse, ContainerListResponse } from './container.schema';
import type { ListQuery } from '@/shared/model/api';

export const containerService = {
  getList: (query?: ListQuery) =>
    fetchApi<ContainerListResponse>('/api/containers', {
      params: query,
      cache: 'no-store',
      tags: CONTAINER_TAGS.list,
    }),

  getById: (id: string) =>
    fetchApi<ContainerApiResponse>(`/api/containers/${id}`, {
      cache: 'no-store',
      tags: CONTAINER_TAGS.all(id),
    }),

  start: (id: string) =>
    fetchApi<{ message: string }>(`/api/containers/${id}/start`, {
      method: 'POST',
    }),

  stop: (id: string) =>
    fetchApi<{ message: string }>(`/api/containers/${id}/stop`, {
      method: 'POST',
    }),

  restart: (id: string) =>
    fetchApi<{ message: string }>(`/api/containers/${id}/restart`, {
      method: 'POST',
    }),

  delete: (id: string, force?: boolean) =>
    fetchApi<{ message: string }>(`/api/containers/${id}`, {
      method: 'DELETE',
      params: force ? { force: 'true' } : undefined,
    }),
};
