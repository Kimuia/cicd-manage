import type { AgentApiResponse } from '@/entity/agent';
import type { AgentMonitorView, AgentCapabilities } from './agent-monitor.type';

function parseCapabilities(str: string): AgentCapabilities {
  try {
    return JSON.parse(str) as AgentCapabilities;
  } catch {
    return { dockerVersion: 'unknown', diskSpace: 0, memory: 0 };
  }
}

export const agentMonitorAdapter = {
  toUI(api: AgentApiResponse): AgentMonitorView {
    return {
      id: api.id,
      type: api.type,
      hostname: api.hostname,
      ipAddress: api.ip_address,
      status: api.status,
      capabilities: parseCapabilities(api.capabilities),
      lastHeartbeatAt: api.last_heartbeat_at,
      createdAt: api.created_at,
    };
  },

  toUIList(apiList: AgentApiResponse[]): AgentMonitorView[] {
    return apiList.map(this.toUI);
  },
};
