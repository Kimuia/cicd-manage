import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'mini-jenkins.db');
const schemaPath = path.join(process.cwd(), 'src', 'db', 'schema.sql');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const schema = fs.readFileSync(schemaPath, 'utf-8');
const db = new Database(dbPath);

db.exec(schema);
db.close();

console.log(`Database initialized: ${dbPath}`);
