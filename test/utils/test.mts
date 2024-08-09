import path from 'node:path';
import { unlink } from 'node:fs';
import { _electron } from 'playwright';
import { test as base } from '@playwright/test';
import knex from 'knex'

import { sleep } from './utils.mts';
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
  launchElectron: (_id?: any, options?: { windowTitle: string }) => AsyncGenerator<Page, void, unknown>
}>({
  launchElectron: async({}, use) => use(async function* (_id, options={ windowTitle: 'Amberpad' }) {
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

    //console.log('#####################################')
    //console.log('options.windowTitle', options.windowTitle)
    var page = await electronApp.firstWindow()
    //console.log( options.windowTitle )
    //while (await page.title() === 'devtools') {
    label:
    while (options.windowTitle !== undefined) {
      const windows = electronApp.windows()
      for (let i = 0; i < windows.length; i++) {
        const window = windows[i]
        const title = await window.title()
        //console.log('TITLES', title.toLocaleLowerCase(), options.windowTitle.toLocaleLowerCase())
        if (title.toLocaleLowerCase() === options.windowTitle.toLocaleLowerCase()) {
          page = window
          break label
        }
      }
      //await page.waitForTimeout(100)
      await sleep(100);
    }

    //console.log('FOUND PAGE', await page.title())
    //console.log('#####################################')
    try {
      await page.waitForLoadState('domcontentloaded')
      yield page;
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