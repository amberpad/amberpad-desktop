import path from 'node:path';
import fs from 'node:fs';
import { _electron } from 'playwright';
import { test as base } from '@playwright/test';
import chalk from 'chalk'
import knex from 'knex'

import { sleep } from './utils.mts';
import seed from './seed.mts';

import type {Page} from '@playwright/test';

const entrypoint = path.resolve('./.package/main.mjs');

type DatabaseType = knex.Knex<any, unknown[]> & {
  destroyDatase: () => Promise<void>
}

const buildDatabasePath = (id: string) => 
  `.run/amberpad.test${id ? ('.' + id) : ''}.amber`;

const buildLogFilePath = (id: string) => 
  `.run/logs/test.${id ? ('.' + id) : ''}.log`;

const removeFile = (path) => fs.existsSync(path) && fs.unlinkSync(path)

const connectDatabase = async (id: string): Promise<DatabaseType> => {
  const databasePath = buildDatabasePath(id)
  removeFile(databasePath)

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

  // Test connection
  try {
    await queries.raw('PRAGMA user_version;')
  } catch (error) {
    throw(`Database could not be decrypted`)
  }

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
  launchElectron: async({ }, use, testInfo) => {
    const context = {
      testId: undefined as unknown as string
    }
    await use(
      async function* (
        options={ 
          id: undefined,
          windowTitle: 'Amberpad',
          seed: undefined
        }
    ) {
        // If not ID generate a random one
        const id = options.id || Math.floor(Math.random() * 0xffffffffff).toString(16).padEnd(10, '0');
        //testInfo.annotations.push({ type: 'identifier', description: id })
        context.testId = id
        const databasePath = buildDatabasePath(id)
        const logFilePath = buildLogFilePath(id)

        const queries = await connectDatabase(id)
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
            __TESTING_ENVRONMENT_DB_PATH: databasePath,
            __TESTING_ENVRONMENT_DB_PASS: 'testing',
            __TESTING_ENVRONMENT_LOG_PATH: logFilePath,
          },
        });
        //electronApp.on('console', (msg) => console.log(`\x1b[40m${msg.text()}\x1b[0m`))

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
          await electronApp.close();
        }
      }
    )

  if (context.testId !== undefined) {
    const databasePath = buildDatabasePath(context.testId)
    const logFilePath = buildLogFilePath(context.testId)
  
    if (testInfo.status !== testInfo.expectedStatus) {
      const logContent = fs.readFileSync(logFilePath,'utf8')
      console.log(chalk.red(`Test ${context.testId} failed this is the history log for the test`))
      console.log(chalk.red(logContent))
      console.log(chalk.red(' ======================== '))
    }
  
    removeFile(databasePath)
    removeFile(logFilePath)
  }

  },
  page: async ({}, use) => {
    // Remove default page so it doest cause troubles
    use(undefined as never);
  }
})
