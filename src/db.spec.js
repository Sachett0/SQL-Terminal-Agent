import { describe, it } from 'node:test';
import { equal } from 'node:assert';
import { generateUser, generateLogEntry } from './mocks.js';
import { createDb } from './db.js';

describe('Database Tests', () => {
  const db = createDb();

  it('should insert a record into the database', async () => {
    const user = generateUser();
    const record = generateLogEntry(user);
    db.prepare(
      `INSERT INTO ACCESS_LOGS (ip, username, firstName, lastName, email, location, jobArea, company, jobTitle, id, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      record.ip,
      record.username,
      record.firstName,
      record.lastName,
      record.email,
      record.location,
      record.jobArea,
      record.company,
      record.jobTitle,
      record.id,
      record.timestamp,
    );
    const all = db.prepare('SELECT COUNT(*) FROM ACCESS_LOGS').all();
    equal(all[0]['COUNT(*)'], 1, 'There should be one record in the database');
  });
});
