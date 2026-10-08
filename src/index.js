import { createInterface } from 'node:readline';
import { styleText } from 'node:util';
import { generateSqlObject, generateTextAnswer } from './ai.js';
import { createDb } from './db.js';
import { DB_NAME } from './constants.js';

const db = createDb(DB_NAME);

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

function prompt(text) {
  return new Promise((resolve) => rl.question(text, resolve));
}
rl.on('close', () => {
  db.close();
  console.log(
    styleText(
      'gray',
      'Conexão com o banco de dados encerrada. Saindo do programa...',
    ),
  );
  process.exit(0);
});

console.log(styleText(['bold', 'cyan'], 'Bem-vindo ao SQL Terminal Agent!'));
while (true) {
  const question = await prompt(
    ['bold', 'magenta'],
    '\nDigite sua pergunta (ou "exit" para sair): ',
  );
  if (!question.trim()) {
    continue; // Skip empty input
  }

  try {
    const sqlObject = await generateSqlObject(question);
    const { sql, explanation } = sqlObject;
    console.log(styleText(['bold', 'cyan'], '\nSQL sugerido:'));
    console.log(styleText('red', sql));
    console.log(styleText('cyan', '\nExplicação:'));
    console.log(styleText('yellow', explanation));

    const confirm = await prompt(
      styleText(['bold', 'green'], '\nDeseja executar esta query? (s/n): '),
    );
    if (confirm.toLowerCase() === 's') {
      const result = await db
        .prepare(sql)
        .all()
        .map((row) => ({
          ...row,
        }));
      const answer = await generateTextAnswer({ question, sql, rows: result });
      console.log(styleText(['bold', 'cyan'], '\nResposta:'));
      console.log(answer);
    } else {
      console.log(styleText('gray', 'Query não executada.'));
    }
  } catch (error) {
    console.error(styleText('red', 'Erro ao executar a query:'), error.message);
  }
}
