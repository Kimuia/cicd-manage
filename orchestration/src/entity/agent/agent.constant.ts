import type { AgentStatus, AgentType } from './agent.schema';

export const AGENT_TAGS = {
  list: 'agents',
  detail: (id: string) => `agent-${id}`,
  all: (id?: string) => (id ? ['agents', `agent-${id}`] : ['agents']),
} as const;

export const AGENT_STATUS_LABEL: Record<AgentStatus, string> = {
  online: '온라인',
  offline: '오프라인',
  busy: '작업 중',
} as const;

export const AGENT_STATUS_VARIANT: Record<AgentStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  online: 'default',
  offline: 'outline',
  busy: 'secondary',
} as const;

export const AGENT_TYPE_LABEL: Record<AgentType, string> = {
  build: '빌드',
  deploy: '배포',
} as const;
