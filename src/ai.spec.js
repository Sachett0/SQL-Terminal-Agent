import { describe, it } from 'node:test';
import { equal } from 'node:assert';

describe('Integration Tests', () => {
  it('should generate a valid SQL object from a question', async (ctx) => {
    ctx.mock.module('ai', {
      exports: {
        generateText: async ({ model, system, user }) => {
          // Mocked response for testing
          return {
            experimental_output: {
              sql: 'SELECT * FROM access_logs;',
              explanation:
                'This SQL query retrieves all records from the access_logs table.',
            },
          };
        },
        Output: {
          object: ({ schema }) => {
            return { schema };
          },
        },
      },
    });

    const { generateSqlObject } = await import('./ai.js');
    const question = 'List all users from the access_logs table.';
    const { sql, explanation } = await generateSqlObject(question);

    // Validate that the SQL is a non-empty string
    equal(typeof sql, 'string', 'SQL should be a string');
    equal(sql.trim().length > 0, true, 'SQL should not be empty');

    equal(
      sql.trim().toUpperCase().startsWith('SELECT'),
      true,
      'SQL should start with SELECT',
    );
  });
});
