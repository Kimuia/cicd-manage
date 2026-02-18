import { z } from 'zod';

export const deploymentApiSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  build_id: z.string(),
  deploy_agent_id: z.string().nullable(),
  status: z.enum(['pending', 'deploying', 'running', 'stopped', 'failed']),
  container_id: z.string().nullable(),
  container_name: z.string().nullable(),
  ports: z.string(),
  env_vars: z.string(),
  started_at: z.string().nullable(),
  stopped_at: z.string().nullable(),
  error_message: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type DeploymentApiResponse = z.infer<typeof deploymentApiSchema>;

export type DeploymentStatus = DeploymentApiResponse['status'];

export interface DeploymentCreateRequest {
  projectId: string;
  buildId: string;
  envVars?: Record<string, string>;
}

export interface DeploymentListResponse {
  deployments: DeploymentApiResponse[];
}
