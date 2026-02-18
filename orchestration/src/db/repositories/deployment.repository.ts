import { getDb } from '../connection';
import type { DeploymentRow } from '@/lib/types';

export const deploymentRepository = {
  findAll(options?: { status?: string; limit?: number; offset?: number }): DeploymentRow[] {
    const { status, limit = 20, offset = 0 } = options ?? {};

    if (status) {
      return getDb()
        .prepare('SELECT * FROM deployments WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?')
        .all(status, limit, offset) as DeploymentRow[];
    }

    return getDb()
      .prepare('SELECT * FROM deployments ORDER BY created_at DESC LIMIT ? OFFSET ?')
      .all(limit, offset) as DeploymentRow[];
  },

  findById(id: string): DeploymentRow | undefined {
    return getDb().prepare('SELECT * FROM deployments WHERE id = ?').get(id) as DeploymentRow | undefined;
  },

  findByProjectId(projectId: string, limit = 20, offset = 0): DeploymentRow[] {
    return getDb()
      .prepare('SELECT * FROM deployments WHERE project_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?')
      .all(projectId, limit, offset) as DeploymentRow[];
  },

  create(deployment: {
    id: string;
    projectId: string;
    buildId: string;
    deployAgentId: string | null;
    containerName: string;
    ports: string;
    envVars: string;
  }): DeploymentRow {
    getDb().prepare(`
      INSERT INTO deployments (id, project_id, build_id, deploy_agent_id, status, container_name, ports, env_vars)
      VALUES (?, ?, ?, ?, 'pending', ?, ?, ?)
    `).run(
      deployment.id,
      deployment.projectId,
      deployment.buildId,
      deployment.deployAgentId,
      deployment.containerName,
      deployment.ports,
      deployment.envVars,
    );

    return this.findById(deployment.id)!;
  },

  updateStatus(
    id: string,
    status: DeploymentRow['status'],
    extra?: {
      containerId?: string;
      errorMessage?: string;
      startedAt?: string;
      stoppedAt?: string;
    },
  ): boolean {
    const now = new Date().toISOString();
    const updates = ['status = ?', 'updated_at = ?'];
    const values: unknown[] = [status, now];

    if (extra?.containerId !== undefined) { updates.push('container_id = ?'); values.push(extra.containerId); }
    if (extra?.errorMessage !== undefined) { updates.push('error_message = ?'); values.push(extra.errorMessage); }
    if (extra?.startedAt !== undefined) { updates.push('started_at = ?'); values.push(extra.startedAt); }
    if (extra?.stoppedAt !== undefined) { updates.push('stopped_at = ?'); values.push(extra.stoppedAt); }

    values.push(id);
    const result = getDb().prepare(`UPDATE deployments SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    return result.changes > 0;
  },
};
