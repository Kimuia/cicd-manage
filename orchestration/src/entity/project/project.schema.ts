import { z } from 'zod';

export const projectApiSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  git_url: z.string(),
  git_branch: z.string(),
  dockerfile_path: z.string(),
  build_args: z.string(),
  env_vars: z.string(),
  port_mappings: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type ProjectApiResponse = z.infer<typeof projectApiSchema>;

export interface ProjectCreateRequest {
  name: string;
  description?: string;
  gitUrl: string;
  gitBranch?: string;
  dockerfilePath?: string;
  buildArgs?: Record<string, string>;
  envVars?: Record<string, string>;
  portMappings?: Array<{ host: number; container: number }>;
}

export interface ProjectUpdateRequest {
  name?: string;
  description?: string;
  gitUrl?: string;
  gitBranch?: string;
  dockerfilePath?: string;
  buildArgs?: Record<string, string>;
  envVars?: Record<string, string>;
  portMappings?: Array<{ host: number; container: number }>;
}

export interface ProjectListResponse {
  projects: ProjectApiResponse[];
}
