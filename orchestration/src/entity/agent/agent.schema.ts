import { z } from 'zod';

export const agentApiSchema = z.object({
  id: z.string(),
  type: z.enum(['build', 'deploy']),
  hostname: z.string(),
  ip_address: z.string(),
  status: z.enum(['online', 'offline', 'busy']),
  capabilities: z.string(),
  public_key: z.string().nullable(),
  last_heartbeat_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type AgentApiResponse = z.infer<typeof agentApiSchema>;

export type AgentType = AgentApiResponse['type'];
export type AgentStatus = AgentApiResponse['status'];

export interface AgentListResponse {
  agents: AgentApiResponse[];
}
