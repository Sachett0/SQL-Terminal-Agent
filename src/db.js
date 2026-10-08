import { DatabaseSync } from 'node:sqlite';

export function createDb(path = ':memory:') {
  const db = new DatabaseSync(path);

  db.exec(`CREATE TABLE IF NOT EXISTS access_logs (
    id TEXT PRIMARY KEY,
    ip TEXT NOT NULL,
    username TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL,
    location TEXT NOT NULL,
    jobArea TEXT NOT NULL,
    company TEXT NOT NULL,
    jobTitle TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL CURRENT_TIMESTAMP
  )`);

  return db;
}

const db = createDb('access_logs.db');
