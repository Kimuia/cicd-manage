import { z } from 'zod';

export const containerApiSchema = z.object({
  id: z.string(),
  deployment_id: z.string().nullable(),
  project_id: z.string().nullable(),
  agent_id: z.string().nullable(),
  name: z.string(),
  image: z.string(),
  status: z.enum(['created', 'running', 'paused', 'restarting', 'exited', 'dead']),
  health: z.enum(['none', 'starting', 'healthy', 'unhealthy']),
  ports: z.string(),
  exit_code: z.number().nullable(),
  restart_count: z.number(),
  started_at: z.string().nullable(),
  finished_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type ContainerApiResponse = z.infer<typeof containerApiSchema>;

export type ContainerStatus = ContainerApiResponse['status'];
export type ContainerHealth = ContainerApiResponse['health'];

export interface ContainerListResponse {
  containers: ContainerApiResponse[];
}
