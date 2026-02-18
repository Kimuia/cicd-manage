import type { ContainerApiResponse } from '@/entity/container';
import type { ContainerListView } from './container-list.type';

function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

export const containerListAdapter = {
  toUI(api: ContainerApiResponse): ContainerListView {
    return {
      id: api.id,
      name: api.name,
      image: api.image,
      status: api.status,
      health: api.health,
      ports: safeJsonParse<Array<{ host: number; container: number }>>(api.ports, []),
      restartCount: api.restart_count,
      createdAt: api.created_at,
    };
  },

  toUIList(apiList: ContainerApiResponse[]): ContainerListView[] {
    return apiList.map(this.toUI);
  },
};
