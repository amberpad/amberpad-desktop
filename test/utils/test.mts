import path from 'node:path';
import { unlinkSync, existsSync } from 'node:fs';
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

const testConnection = async function (
  queries: knex.Knex<any, unknown[]>
): Promise<Boolean> {
  try {
    await queries.raw('PRAGMA user_version;')
    return true
  } catch (error) {
    throw(`Database could not be decrypted`)
  }
}

const removeDatabaseFile = (path) => existsSync(path) && unlinkSync(path)

const connectDatabase = async (id: string): Promise<DatabaseType> => {
  const databasePath = buildDatabasePath(id)
  removeDatabaseFile(databasePath)

  const queries = knex({
    client: 'better-sqlite3',
    debug: global.DEBUG,
    useNullAsDefault: true,
    connection: {
      filename: databasePath,
      options: {
        nativeBinding: path.join(
          // It is gonna use the binding (.node) in the :root_folder/node_modules/ and not the one 
          // .package/node_modules cause the one in .package is compiled to work inside electron
          'node_modules',
          'better-sqlite3-multiple-ciphers--test',
          'build',
          'Release',
          'better_sqlite3.node'
        )
      }
    },
    pool: {
      // https://knexjs.org/faq/recipes.html#db-access-using-sqlite-and-sqlcipher
      afterCreate(db, fn) {
        db.pragma(`cipher='sqlcipher'`)
        db.pragma(`legacy=4`)
        // If this key is changed it should be changed also in the knex connection of 
        // the main thread of electon
        db.pragma(`key='testing'`);
        fn();
      }
    }
  })

  if (await testConnection(queries)) 

  await queries.migrate.up({
    directory: path.resolve('./resources/migrations'),
    extension: 'ts',
    tableName: 'knex_migrations'
  })

  return queries as DatabaseType;
}

// Extend the Test object with electron connection and database utilities
export const test = base.extend<{
  launchElectron: ( 
    options?: { 
      id?: string,
      windowTitle?: string
      seed?: string,
    }
  ) => AsyncGenerator<Page, void, unknown>
}>({
  launchElectron: async({}, use) => use(
    async function* (
      options={ 
        id: undefined,
        windowTitle: 'Amberpad',
        seed: undefined
      }
    ) {
    // If not ID generate a random one
    const id = options.id || Math.floor(Math.random() * 0xffffffffff).toString(16).padEnd(10, '0');
    const queries = await connectDatabase(id);
    if (options.seed !== undefined) {
      try {
        await seed(queries, options.seed);
      } catch (error) {
        if (error.code === 'ERR_MODULE_NOT_FOUND') {
          console.warn(`Seed '${options.seed}' was not found in the seeds folder"`);
        } else if (error.code !== 'ERR_MODULE_NOT_FOUND') {
          throw error;
        }
      }
    }

    const electronApp = await _electron.launch({ 
      args: [entrypoint],
      env: {
        ...process.env,
        __TESTING_ENVRONMENT_DB_PATH: buildDatabasePath(id),
      },
    });
    electronApp.on('console', (msg) => console.log(`\x1b[40m${msg.text()}\x1b[0m`))

    var page = await electronApp.firstWindow()
    label:
    while (options.windowTitle !== undefined) {
      const windows = electronApp.windows()
      for (let i = 0; i < windows.length; i++) {
        const window = windows[i]
        const title = await window.title()
        if (title.toLocaleLowerCase() === options.windowTitle.toLocaleLowerCase()) {
          page = window
          break label
        }
      }
      await sleep(100);
    }

    try {
      await page.waitForLoadState('domcontentloaded')
      yield page;
    } finally {
      await queries.destroy();
      removeDatabaseFile(buildDatabasePath(id))
      await electronApp.close();
    }
  }),
  page: async ({}, use) => {
    // Remove default page so it doest cause troubles
    use(undefined as never);
  }
});