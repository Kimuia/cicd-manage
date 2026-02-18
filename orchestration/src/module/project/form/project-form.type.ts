import { z } from 'zod';

export const projectFormSchema = z.object({
  name: z.string().min(1, '프로젝트명을 입력하세요').max(100),
  description: z.string().optional().default(''),
  gitUrl: z.string().url('유효한 Git URL을 입력하세요'),
  gitBranch: z.string().optional().default('main'),
  dockerfilePath: z.string().optional().default('Dockerfile'),
  buildArgs: z.string().optional().default(''),
  envVars: z.string().optional().default(''),
  portMappings: z.string().optional().default(''),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;

export interface ProjectFormView {
  name: string;
  description: string;
  gitUrl: string;
  gitBranch: string;
  dockerfilePath: string;
  buildArgs: string;
  envVars: string;
  portMappings: string;
}
