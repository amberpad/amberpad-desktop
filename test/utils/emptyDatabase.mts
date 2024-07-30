import path from 'node:path'
import knex from 'knex'

export default async function emptyDatabase (queries: knex.Knex<any, unknown[]>) {
  try {
    await queries.transaction(async (context) => {
      const tables = await (await context.raw("SELECT name FROM sqlite_schema WHERE type ='table'"))
        .map((item) => item.name)
        .filter((name) => ![ // Exclude this tables
          'knex_migrations',
          'knex_migrations_lock',
          'searches',
          'searches_data',
          'searches_idx',
          'searches_content',
          'searches_docsize',
          'searches_config'
        ].some((item) => item === name))

      for (let i = 0; i < tables.length; i++) {
        const table = tables[i]
        await context(table).truncate();
      }
    });
  } catch (error) {
    console.error(error);
  }
}