import { createWriteStream, statSync } from 'node:fs';
import { faker } from '@faker-js/faker';
import { LOG_FILE, LOG_INTERVAL } from './constants.js';
import { generateUser, generateLogEntry } from './mocks.js';

const maxRecords = Number(process.argv[2] || Infinity); // Get the maximum number of records from command line argument or set to infinity

if (
  (!Number.isInteger(maxRecords) && Number.isFinite(maxRecords)) ||
  Number.isNaN(maxRecords) ||
  maxRecords <= 0
) {
  console.error('Uso: npm run seed -- <quantidade> ');
  console.error('A quantidade deve ser um número inteiro positivo.');
  process.exit(1);
}

const stream = createWriteStream(LOG_FILE);

//Backpressure implementation
function writeRecord(line) {
  return new Promise((resolve) => {
    if (!stream.write(line)) {
      stream.once('drain', resolve);
    } else {
      resolve();
    }
  });
}

console.log(`Gerando registros de log no arquivo ${LOG_FILE}...`);
console.log(`Máximo de registros: ${maxRecords.toLocaleString()}`);

function convertFromBytesToGB(bytes) {
  return (bytes / 1024 / 1024 / 1024).toFixed(4);
}

const users = Array.from({ length: 5 }, generateUser);

process.on('SIGINT', () => {
  stream.end(() => {
    const { size } = statSync(LOG_FILE);
    console.log(
      `Registros gerados: ${count.toLocaleString()} | Tamanho do arquivo: ${convertFromBytesToGB(size)} GB`,
    );
    console.log('Geração de registros interrompida pelo usuário.');
  });
});

let count = 0;
while (count < maxRecords) {
  const user = faker.helpers.arrayElement(users);
  const record = generateLogEntry(user);

  await writeRecord(JSON.stringify(record) + '\n');
  count++;

  if (count % LOG_INTERVAL === 0) {
    const { size } = statSync(LOG_FILE);
    console.log(
      `Registros gerados: ${count.toLocaleString()} | Tamanho do arquivo: ${convertFromBytesToGB(size)} GB`,
    );
  }
}

stream.end(() => {
  const { size } = statSync(LOG_FILE);
  console.log(
    `Registros gerados: ${count.toLocaleString()} | Tamanho do arquivo: ${convertFromBytesToGB(size)} GB`,
  );
  console.log('Geração de registros concluída.');
});
