import { getDb } from '../connection';
import type { ProjectRow } from '@/lib/types';

export const projectRepository = {
  findAll(limit = 20, offset = 0): ProjectRow[] {
    return getDb()
      .prepare('SELECT * FROM projects ORDER BY created_at DESC LIMIT ? OFFSET ?')
      .all(limit, offset) as ProjectRow[];
  },

  findById(id: string): ProjectRow | undefined {
    return getDb().prepare('SELECT * FROM projects WHERE id = ?').get(id) as ProjectRow | undefined;
  },

  findByName(name: string): ProjectRow | undefined {
    return getDb().prepare('SELECT * FROM projects WHERE name = ?').get(name) as ProjectRow | undefined;
  },

  create(project: {
    id: string;
    name: string;
    description: string;
    gitUrl: string;
    gitBranch: string;
    dockerfilePath: string;
    buildArgs: Record<string, string>;
    envVars: Record<string, string>;
    portMappings: Array<{ host: number; container: number }>;
  }): ProjectRow {
    getDb().prepare(`
      INSERT INTO projects (id, name, description, git_url, git_branch, dockerfile_path, build_args, env_vars, port_mappings)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      project.id,
      project.name,
      project.description,
      project.gitUrl,
      project.gitBranch,
      project.dockerfilePath,
      JSON.stringify(project.buildArgs),
      JSON.stringify(project.envVars),
      JSON.stringify(project.portMappings),
    );

    return this.findById(project.id)!;
  },

  update(
    id: string,
    fields: Partial<{
      name: string;
      description: string;
      gitUrl: string;
      gitBranch: string;
      dockerfilePath: string;
      buildArgs: Record<string, string>;
      envVars: Record<string, string>;
      portMappings: Array<{ host: number; container: number }>;
    }>,
  ): ProjectRow | undefined {
    const existing = this.findById(id);
    if (!existing) return undefined;

    const now = new Date().toISOString();
    const updates: string[] = [];
    const values: unknown[] = [];

    if (fields.name !== undefined) { updates.push('name = ?'); values.push(fields.name); }
    if (fields.description !== undefined) { updates.push('description = ?'); values.push(fields.description); }
    if (fields.gitUrl !== undefined) { updates.push('git_url = ?'); values.push(fields.gitUrl); }
    if (fields.gitBranch !== undefined) { updates.push('git_branch = ?'); values.push(fields.gitBranch); }
    if (fields.dockerfilePath !== undefined) { updates.push('dockerfile_path = ?'); values.push(fields.dockerfilePath); }
    if (fields.buildArgs !== undefined) { updates.push('build_args = ?'); values.push(JSON.stringify(fields.buildArgs)); }
    if (fields.envVars !== undefined) { updates.push('env_vars = ?'); values.push(JSON.stringify(fields.envVars)); }
    if (fields.portMappings !== undefined) { updates.push('port_mappings = ?'); values.push(JSON.stringify(fields.portMappings)); }

    if (updates.length === 0) return existing;

    updates.push('updated_at = ?');
    values.push(now);
    values.push(id);

    getDb().prepare(`UPDATE projects SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    return this.findById(id);
  },

  delete(id: string): boolean {
    const result = getDb().prepare('DELETE FROM projects WHERE id = ?').run(id);
    return result.changes > 0;
  },
};
