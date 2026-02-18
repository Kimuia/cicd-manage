-- Mini Jenkins - Database Schema

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- agents: build/deploy server registration
CREATE TABLE IF NOT EXISTS agents (
  id             TEXT PRIMARY KEY,
  type           TEXT NOT NULL CHECK (type IN ('build', 'deploy')),
  hostname       TEXT NOT NULL,
  ip_address     TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'busy')),
  capabilities   TEXT DEFAULT '{}',
  public_key     TEXT,
  last_heartbeat_at TEXT,
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_agents_type ON agents(type);
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);

-- projects: project configuration
CREATE TABLE IF NOT EXISTS projects (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL UNIQUE,
  description     TEXT DEFAULT '',
  git_url         TEXT NOT NULL,
  git_branch      TEXT NOT NULL DEFAULT 'main',
  dockerfile_path TEXT NOT NULL DEFAULT 'Dockerfile',
  build_args      TEXT DEFAULT '{}',
  env_vars        TEXT DEFAULT '{}',
  port_mappings   TEXT DEFAULT '[]',
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_projects_name ON projects(name);

-- builds: build records
CREATE TABLE IF NOT EXISTS builds (
  id              TEXT PRIMARY KEY,
  project_id      TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  build_agent_id  TEXT REFERENCES agents(id) ON DELETE SET NULL,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'queued', 'running', 'success', 'failed', 'cancelled')),
  git_commit      TEXT,
  git_branch      TEXT,
  image_name      TEXT,
  image_tag       TEXT,
  image_size      INTEGER,
  started_at      TEXT,
  completed_at    TEXT,
  error_message   TEXT,
  logs            TEXT DEFAULT '',
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_builds_project_id ON builds(project_id);
CREATE INDEX IF NOT EXISTS idx_builds_status ON builds(status);
CREATE INDEX IF NOT EXISTS idx_builds_created_at ON builds(created_at);

-- deployments: deployment records
CREATE TABLE IF NOT EXISTS deployments (
  id               TEXT PRIMARY KEY,
  project_id       TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  build_id         TEXT NOT NULL REFERENCES builds(id) ON DELETE CASCADE,
  deploy_agent_id  TEXT REFERENCES agents(id) ON DELETE SET NULL,
  status           TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'deploying', 'running', 'stopped', 'failed')),
  container_id     TEXT,
  container_name   TEXT,
  ports            TEXT DEFAULT '[]',
  env_vars         TEXT DEFAULT '{}',
  started_at       TEXT,
  stopped_at       TEXT,
  error_message    TEXT,
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_deployments_project_id ON deployments(project_id);
CREATE INDEX IF NOT EXISTS idx_deployments_build_id ON deployments(build_id);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON deployments(status);

-- containers: active container tracking
CREATE TABLE IF NOT EXISTS containers (
  id              TEXT PRIMARY KEY,
  deployment_id   TEXT REFERENCES deployments(id) ON DELETE SET NULL,
  project_id      TEXT REFERENCES projects(id) ON DELETE SET NULL,
  agent_id        TEXT REFERENCES agents(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  image           TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'running', 'paused', 'restarting', 'exited', 'dead')),
  health          TEXT NOT NULL DEFAULT 'none' CHECK (health IN ('none', 'starting', 'healthy', 'unhealthy')),
  ports           TEXT DEFAULT '[]',
  exit_code       INTEGER,
  restart_count   INTEGER DEFAULT 0,
  started_at      TEXT,
  finished_at     TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_containers_deployment_id ON containers(deployment_id);
CREATE INDEX IF NOT EXISTS idx_containers_project_id ON containers(project_id);
CREATE INDEX IF NOT EXISTS idx_containers_agent_id ON containers(agent_id);
CREATE INDEX IF NOT EXISTS idx_containers_status ON containers(status);

-- users: authentication
CREATE TABLE IF NOT EXISTS users (
  id              TEXT PRIMARY KEY,
  username        TEXT NOT NULL UNIQUE,
  email           TEXT NOT NULL UNIQUE,
  password_hash   TEXT NOT NULL,
  role            TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'viewer')),
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
