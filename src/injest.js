import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { LOG_FILE, LOG_INTERVAL, DB_NAME } from './constants.js';
import { createDb } from './db.js';

const db = createDb(DB_NAME);
const fileStream = createReadStream(LOG_FILE);
const rl = createInterface({
  input: fileStream,
  crlfDelay: Infinity,
});

console.log(`Lendo ${LOG_FILE} e inserindo registros no banco de dados...`);

let count = 0;

for await (const line of rl) {
  if (line.trim() === '') continue; // Skip empty lines

  let record;
  try {
    record = JSON.parse(line);
  } catch (error) {
    continue; // Skip this line and continue with the next
  }

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
  count++;

  if (count % LOG_INTERVAL === 0) {
    console.log(`Inseridos: ${count.toLocaleString()}`);
  }
}

console.log(
  `Ingestão Concluída - Registros inseridos: ${count.toLocaleString()}`,
);
db.close();
