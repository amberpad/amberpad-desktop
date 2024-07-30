import path from 'node:path';
import { unlink } from 'node:fs';
import { _electron } from 'playwright';
import { test as base } from '@playwright/test';
import knex from 'knex'

import seed from './seed.mts';

import type {Page} from '@playwright/test';

const entrypoint = path.resolve('./.package/main.mjs');

type DatabaseType = knex.Knex<any, unknown[]> & {
  destroyDatase: () => Promise<void>
}

const buildDatabasePath = (id: string) => 
  `.run/amberpad.test${id ? ('.' + id) : ''}.db`;

const connectDatabase = async (id: string): Promise<DatabaseType> => {
  const queries = knex({
    client: 'sqlite3',
    debug: global.DEBUG,
    connection: {
      filename: buildDatabasePath(id),
    },
    useNullAsDefault: true,
  })

  await queries.migrate.up({
    directory: path.resolve('./resources/migrations'),
    extension: 'ts',
    tableName: 'knex_migrations'
  })

  return queries as DatabaseType;
}

// Extend the Test object with electron connection and database utilities
export const test = base.extend<{
  launchElectron: (_id?: any) => AsyncGenerator<Page, void, unknown>
}>({
  launchElectron: async({}, use) => use(async function* (_id) {
    // If not ID generate a random one
    const id = _id || Math.floor(Math.random() * 0xffffffffff).toString(16).padEnd(10, '0');
    const queries = await connectDatabase(id);
    try {
      id && await seed(queries, id);
    } catch (error) {
      if (error.code === 'ERR_MODULE_NOT_FOUND' && _id) {
        console.warn(`Seed '${_id}' was not found in the seeds folder`);
      } else if (error.code !== 'ERR_MODULE_NOT_FOUND') {
        throw error;
      }
    }
    const electronApp = await _electron.launch({ 
      args: [entrypoint],
      env: {
        ...process.env,
        __TESTING_ENVRONMENT_DB_PATH: buildDatabasePath(id),
      }
    });
    //electronApp.on('console', async msg => { console.log(msg); });
    try {
      yield await electronApp.firstWindow();
    } finally {
      await queries.destroy();
      unlink(
        buildDatabasePath(id), 
        (error) => error // If errors ignore
      );
      await electronApp.close();
    }
  }),
  page: async ({}, use) => {
    use(undefined as never);
  }
});