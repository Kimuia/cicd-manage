export interface AgentRow {
  id: string;
  type: 'build' | 'deploy';
  hostname: string;
  ip_address: string;
  status: 'online' | 'offline' | 'busy';
  capabilities: string;
  public_key: string | null;
  last_heartbeat_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectRow {
  id: string;
  name: string;
  description: string;
  git_url: string;
  git_branch: string;
  dockerfile_path: string;
  build_args: string;
  env_vars: string;
  port_mappings: string;
  created_at: string;
  updated_at: string;
}

export interface BuildRow {
  id: string;
  project_id: string;
  build_agent_id: string | null;
  status: 'pending' | 'queued' | 'running' | 'success' | 'failed' | 'cancelled';
  git_commit: string | null;
  git_branch: string | null;
  image_name: string | null;
  image_tag: string | null;
  image_size: number | null;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  logs: string;
  created_at: string;
  updated_at: string;
}

export interface DeploymentRow {
  id: string;
  project_id: string;
  build_id: string;
  deploy_agent_id: string | null;
  status: 'pending' | 'deploying' | 'running' | 'stopped' | 'failed';
  container_id: string | null;
  container_name: string | null;
  ports: string;
  env_vars: string;
  started_at: string | null;
  stopped_at: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContainerRow {
  id: string;
  deployment_id: string | null;
  project_id: string | null;
  agent_id: string | null;
  name: string;
  image: string;
  status: 'created' | 'running' | 'paused' | 'restarting' | 'exited' | 'dead';
  health: 'none' | 'starting' | 'healthy' | 'unhealthy';
  ports: string;
  exit_code: number | null;
  restart_count: number;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
  updated_at: string;
}
