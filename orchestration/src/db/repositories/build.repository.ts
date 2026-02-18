import { getDb } from '../connection';
import type { BuildRow } from '@/lib/types';

export const buildRepository = {
  findAll(options?: { status?: string; limit?: number; offset?: number }): BuildRow[] {
    const { status, limit = 20, offset = 0 } = options ?? {};

    if (status) {
      return getDb()
        .prepare('SELECT * FROM builds WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?')
        .all(status, limit, offset) as BuildRow[];
    }

    return getDb()
      .prepare('SELECT * FROM builds ORDER BY created_at DESC LIMIT ? OFFSET ?')
      .all(limit, offset) as BuildRow[];
  },

  findById(id: string): BuildRow | undefined {
    return getDb().prepare('SELECT * FROM builds WHERE id = ?').get(id) as BuildRow | undefined;
  },

  findByProjectId(projectId: string, limit = 20, offset = 0): BuildRow[] {
    return getDb()
      .prepare('SELECT * FROM builds WHERE project_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?')
      .all(projectId, limit, offset) as BuildRow[];
  },

  create(build: {
    id: string;
    projectId: string;
    buildAgentId: string | null;
    gitBranch: string;
    gitCommit?: string;
    imageName: string;
    imageTag: string;
  }): BuildRow {
    getDb().prepare(`
      INSERT INTO builds (id, project_id, build_agent_id, status, git_branch, git_commit, image_name, image_tag)
      VALUES (?, ?, ?, 'pending', ?, ?, ?, ?)
    `).run(
      build.id,
      build.projectId,
      build.buildAgentId,
      build.gitBranch,
      build.gitCommit ?? null,
      build.imageName,
      build.imageTag,
    );

    return this.findById(build.id)!;
  },

  updateStatus(
    id: string,
    status: BuildRow['status'],
    extra?: {
      errorMessage?: string;
      imageSize?: number;
      startedAt?: string;
      completedAt?: string;
    },
  ): boolean {
    const now = new Date().toISOString();
    const updates = ['status = ?', 'updated_at = ?'];
    const values: unknown[] = [status, now];

    if (extra?.errorMessage !== undefined) { updates.push('error_message = ?'); values.push(extra.errorMessage); }
    if (extra?.imageSize !== undefined) { updates.push('image_size = ?'); values.push(extra.imageSize); }
    if (extra?.startedAt !== undefined) { updates.push('started_at = ?'); values.push(extra.startedAt); }
    if (extra?.completedAt !== undefined) { updates.push('completed_at = ?'); values.push(extra.completedAt); }

    values.push(id);
    const result = getDb().prepare(`UPDATE builds SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    return result.changes > 0;
  },

  appendLog(id: string, logLine: string): void {
    getDb().prepare(`
      UPDATE builds SET logs = logs || ?, updated_at = ? WHERE id = ?
    `).run(logLine + '\n', new Date().toISOString(), id);
  },

  delete(id: string): boolean {
    const result = getDb().prepare('DELETE FROM builds WHERE id = ?').run(id);
    return result.changes > 0;
  },
};
