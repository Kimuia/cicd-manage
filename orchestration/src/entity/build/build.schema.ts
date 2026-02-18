import { z } from 'zod';

export const buildApiSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  build_agent_id: z.string().nullable(),
  status: z.enum(['pending', 'queued', 'running', 'success', 'failed', 'cancelled']),
  git_commit: z.string().nullable(),
  git_branch: z.string().nullable(),
  image_name: z.string().nullable(),
  image_tag: z.string().nullable(),
  image_size: z.number().nullable(),
  started_at: z.string().nullable(),
  completed_at: z.string().nullable(),
  error_message: z.string().nullable(),
  logs: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type BuildApiResponse = z.infer<typeof buildApiSchema>;

export type BuildStatus = BuildApiResponse['status'];

export interface BuildTriggerRequest {
  gitBranch?: string;
  gitCommit?: string;
}

export interface BuildListResponse {
  builds: BuildApiResponse[];
}
