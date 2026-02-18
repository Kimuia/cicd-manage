import type { ProjectApiResponse, ProjectCreateRequest, ProjectUpdateRequest } from '@/entity/project';
import type { ProjectFormView, ProjectFormData } from './project-form.type';

function parseJsonString(str: string): Record<string, string> {
  if (!str.trim()) return {};
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
}

function parsePortMappings(str: string): Array<{ host: number; container: number }> {
  if (!str.trim()) return [];
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
}

export const projectFormAdapter = {
  toFormView(api: ProjectApiResponse): ProjectFormView {
    return {
      name: api.name,
      description: api.description,
      gitUrl: api.git_url,
      gitBranch: api.git_branch,
      dockerfilePath: api.dockerfile_path,
      buildArgs: api.build_args === '{}' ? '' : api.build_args,
      envVars: api.env_vars === '{}' ? '' : api.env_vars,
      portMappings: api.port_mappings === '[]' ? '' : api.port_mappings,
    };
  },

  toCreateRequest(form: ProjectFormData): ProjectCreateRequest {
    return {
      name: form.name,
      description: form.description,
      gitUrl: form.gitUrl,
      gitBranch: form.gitBranch || 'main',
      dockerfilePath: form.dockerfilePath || 'Dockerfile',
      buildArgs: parseJsonString(form.buildArgs ?? ''),
      envVars: parseJsonString(form.envVars ?? ''),
      portMappings: parsePortMappings(form.portMappings ?? ''),
    };
  },

  toUpdateRequest(form: ProjectFormData): ProjectUpdateRequest {
    return {
      name: form.name,
      description: form.description,
      gitUrl: form.gitUrl,
      gitBranch: form.gitBranch || undefined,
      dockerfilePath: form.dockerfilePath || undefined,
      buildArgs: parseJsonString(form.buildArgs ?? ''),
      envVars: parseJsonString(form.envVars ?? ''),
      portMappings: parsePortMappings(form.portMappings ?? ''),
    };
  },
};
