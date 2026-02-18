import { fetchApi } from '@/shared/lib/fetcher';
import { PROJECT_TAGS } from './project.constant';
import type { ProjectApiResponse, ProjectCreateRequest, ProjectUpdateRequest, ProjectListResponse } from './project.schema';
import type { ListQuery } from '@/shared/model/api';

export const projectService = {
  getList: (query?: ListQuery) =>
    fetchApi<ProjectListResponse>('/api/projects', {
      params: query,
      tags: PROJECT_TAGS.list,
      cache: 'no-store',
    }),

  getById: (id: string) =>
    fetchApi<ProjectApiResponse>(`/api/projects/${id}`, {
      tags: PROJECT_TAGS.all(id),
      cache: 'no-store',
    }),

  create: (data: ProjectCreateRequest) =>
    fetchApi<ProjectApiResponse>('/api/projects', {
      method: 'POST',
      body: data,
    }),

  update: (id: string, data: ProjectUpdateRequest) =>
    fetchApi<ProjectApiResponse>(`/api/projects/${id}`, {
      method: 'PUT',
      body: data,
    }),

  delete: (id: string) =>
    fetchApi<{ message: string }>(`/api/projects/${id}`, {
      method: 'DELETE',
    }),
};
