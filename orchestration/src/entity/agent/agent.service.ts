import { fetchApi } from '@/shared/lib/fetcher';
import { AGENT_TAGS } from './agent.constant';
import type { AgentApiResponse, AgentListResponse } from './agent.schema';

export const agentService = {
  getList: () =>
    fetchApi<AgentListResponse>('/api/agents', {
      cache: 'no-store',
      tags: AGENT_TAGS.list,
    }),

  getById: (id: string) =>
    fetchApi<AgentApiResponse>(`/api/agents/${id}`, {
      cache: 'no-store',
      tags: AGENT_TAGS.all(id),
    }),

  delete: (id: string) =>
    fetchApi<{ message: string }>(`/api/agents/${id}`, {
      method: 'DELETE',
    }),
};
