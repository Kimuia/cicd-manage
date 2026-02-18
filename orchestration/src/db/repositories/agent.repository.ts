import { getDb } from '../connection';
import type { AgentRow } from '@/lib/types';

export const agentRepository = {
  findAll(): AgentRow[] {
    return getDb().prepare('SELECT * FROM agents ORDER BY created_at DESC').all() as AgentRow[];
  },

  findById(id: string): AgentRow | undefined {
    return getDb().prepare('SELECT * FROM agents WHERE id = ?').get(id) as AgentRow | undefined;
  },

  findByType(type: 'build' | 'deploy'): AgentRow[] {
    return getDb().prepare('SELECT * FROM agents WHERE type = ? AND status != ?').all(type, 'offline') as AgentRow[];
  },

  upsert(agent: {
    id: string;
    type: 'build' | 'deploy';
    hostname: string;
    ipAddress: string;
    capabilities: Record<string, unknown>;
    publicKey?: string;
  }): AgentRow {
    const now = new Date().toISOString();
    const db = getDb();

    db.prepare(`
      INSERT INTO agents (id, type, hostname, ip_address, status, capabilities, public_key, last_heartbeat_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'online', ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        hostname = excluded.hostname,
        ip_address = excluded.ip_address,
        status = 'online',
        capabilities = excluded.capabilities,
        public_key = excluded.public_key,
        last_heartbeat_at = excluded.last_heartbeat_at,
        updated_at = excluded.updated_at
    `).run(
      agent.id,
      agent.type,
      agent.hostname,
      agent.ipAddress,
      JSON.stringify(agent.capabilities),
      agent.publicKey ?? null,
      now,
      now,
      now,
    );

    return this.findById(agent.id)!;
  },

  updateHeartbeat(
    id: string,
    status: 'online' | 'busy',
    metrics: Record<string, unknown>,
  ): boolean {
    const now = new Date().toISOString();
    const existing = this.findById(id);
    if (!existing) return false;

    const capabilities = {
      ...JSON.parse(existing.capabilities),
      metrics,
    };

    const result = getDb().prepare(`
      UPDATE agents SET status = ?, capabilities = ?, last_heartbeat_at = ?, updated_at = ?
      WHERE id = ?
    `).run(status, JSON.stringify(capabilities), now, now, id);

    return result.changes > 0;
  },

  delete(id: string): boolean {
    const result = getDb().prepare('DELETE FROM agents WHERE id = ?').run(id);
    return result.changes > 0;
  },
};
