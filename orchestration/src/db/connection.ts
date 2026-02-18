import Database from 'better-sqlite3';
import path from 'node:path';

const DB_PATH = path.join(process.cwd(), 'data', 'mini-jenkins.db');

let instance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!instance) {
    instance = new Database(DB_PATH);
    instance.pragma('journal_mode = WAL');
    instance.pragma('foreign_keys = ON');
  }
  return instance;
}
