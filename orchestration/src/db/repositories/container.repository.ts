import { getDb } from '../connection';
import type { ContainerRow } from '@/lib/types';

export const containerRepository = {
  findAll(options?: { status?: string; limit?: number; offset?: number }): ContainerRow[] {
    const { status, limit = 20, offset = 0 } = options ?? {};

    if (status) {
      return getDb()
        .prepare('SELECT * FROM containers WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?')
        .all(status, limit, offset) as ContainerRow[];
    }

    return getDb()
      .prepare('SELECT * FROM containers ORDER BY created_at DESC LIMIT ? OFFSET ?')
      .all(limit, offset) as ContainerRow[];
  },

  findById(id: string): ContainerRow | undefined {
    return getDb().prepare('SELECT * FROM containers WHERE id = ?').get(id) as ContainerRow | undefined;
  },

  findByDeploymentId(deploymentId: string): ContainerRow | undefined {
    return getDb()
      .prepare('SELECT * FROM containers WHERE deployment_id = ?')
      .get(deploymentId) as ContainerRow | undefined;
  },

  create(container: {
    id: string;
    deploymentId: string | null;
    projectId: string | null;
    agentId: string | null;
    name: string;
    image: string;
    ports: string;
  }): ContainerRow {
    getDb().prepare(`
      INSERT INTO containers (id, deployment_id, project_id, agent_id, name, image, status, health, ports, started_at)
      VALUES (?, ?, ?, ?, ?, ?, 'running', 'starting', ?, datetime('now'))
    `).run(
      container.id,
      container.deploymentId,
      container.projectId,
      container.agentId,
      container.name,
      container.image,
      container.ports,
    );

    return this.findById(container.id)!;
  },

  updateStatus(id: string, status: ContainerRow['status'], extra?: {
    health?: ContainerRow['health'];
    exitCode?: number;
    finishedAt?: string;
  }): boolean {
    const now = new Date().toISOString();
    const updates = ['status = ?', 'updated_at = ?'];
    const values: unknown[] = [status, now];

    if (extra?.health !== undefined) { updates.push('health = ?'); values.push(extra.health); }
    if (extra?.exitCode !== undefined) { updates.push('exit_code = ?'); values.push(extra.exitCode); }
    if (extra?.finishedAt !== undefined) { updates.push('finished_at = ?'); values.push(extra.finishedAt); }

    values.push(id);
    const result = getDb().prepare(`UPDATE containers SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    return result.changes > 0;
  },

  delete(id: string): boolean {
    const result = getDb().prepare('DELETE FROM containers WHERE id = ?').run(id);
    return result.changes > 0;
  },
};
