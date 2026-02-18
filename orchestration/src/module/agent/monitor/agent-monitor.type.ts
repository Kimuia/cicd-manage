import type { AgentType, AgentStatus } from '@/entity/agent';

export interface AgentMonitorView {
  id: string;
  type: AgentType;
  hostname: string;
  ipAddress: string;
  status: AgentStatus;
  capabilities: AgentCapabilities;
  lastHeartbeatAt: string | null;
  createdAt: string;
}

export interface AgentCapabilities {
  dockerVersion: string;
  gitVersion?: string;
  diskSpace: number;
  memory: number;
}
