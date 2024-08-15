import path from 'node:path'
import fs from 'node:fs'
import { app } from 'electron'
import knex from 'knex'

import dbSession from "@main/utils/database/session"
import { resolveFromRoot, resolveFromUserData } from "@main/utils/locations"
import { ThrowFatalError, ThrowError } from '@main/utils/errors';
import seed from '@main/utils/database/seed'

/******************************************************************************
 * Set up database location
 ******************************************************************************/

const databaseLocations = {
  'production': resolveFromUserData('amberpad.db'),
  'development' : resolveFromUserData('amberpad.development.db'),
  'testing': process.env.__TESTING_ENVRONMENT_DB_PATH,
}
const databasePath = (
  databaseLocations[globals.ENVIRONMENT] || 
  databaseLocations['production']
)
// Create folder for db if it doesn't exists
if (!fs.existsSync(path.dirname(databasePath))){
  fs.mkdirSync(path.dirname(databasePath))
}

/******************************************************************************
 * Export database object
 ******************************************************************************/

const Database = {
  queriesManager: undefined,
  connectDatabase: async function () {
    let session = undefined
    if (globals.ENVIRONMENT !== 'testing') {
      session = await dbSession.get()
      if (!session) {
        const passphrase = await dbSession.generatePassphrase()
        session = await dbSession.create(passphrase)
      }
    }

    this.queriesManager = knex({
      client: 'better-sqlite3',
      debug: true,
      log: {
        warn: console.warn,
        error: console.error,
        deprecate: console.warn,
        debug: console.debug,
      },
      useNullAsDefault: true,
      connection: {
        filename: databasePath,
        options: {
          // note: we need this in order to use encryption
          nativeBinding: resolveFromRoot(
            'node_modules',
            'better-sqlite3-multiple-ciphers',
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
          db.pragma(`key='${globals.ENVIRONMENT === 'testing' ? 'testing' : session.hash}'`);
          fn();
        }
      }
    })

    await this.testConnection()
    return this.queriesManager;
  },
  init: async function () {
    if (this.queriesManager === undefined) {
      this.queriesManager = await this.connectDatabase();
    }

    // Run setup migrations
    try {
      const [version, applied] = await this.queriesManager.migrate.latest({
        directory: resolveFromRoot('./resources/migrations'),
        extension: 'ts',
        tableName: 'knex_migrations'
      })

      if (globals.ENVIRONMENT === 'development') {
        const [completed, pending] = await this.queriesManager.migrate.list({
          directory: resolveFromRoot('./resources/migrations'),
          extension: 'ts',
          tableName: 'knex_migrations'
        })
  
        if (
          applied.length > 0 &&
          pending.length === 0 &&
          globals.SEED !== undefined && 
          globals.SEED !== null
        ) {
          seed(this.queriesManager, globals.SEED)
        }
      }
    } catch (error) {
      console.error('There was a problem running migrations in the database', JSON.stringify(error))
      ThrowFatalError({
        msg: 'Unable to set up the database, the app will be closed',
        error: error,
      })
    }

    return this
  },
  destroy: async function () {
    this.queriesManager.destroy();
  },
  getManager: async function () {
    if (this.queriesManager === undefined) {
      this.queriesManager = await this.connectDatabase();
    }
    return this.queriesManager;
  },
  testConnection: async function (): Promise<Boolean> {
    try {
      await this.queriesManager.raw('PRAGMA user_version;')
      return true
    } catch (error) {
      console.error('Unable to connect to the database, check that is decrypted correctly', 
        JSON.stringify(error))
      ThrowFatalError({
        msg: 'Unable to connect to the database, the app will be closed',
        error: error,
      })
      return false
    }
  },
  withManager: async function* (
    { 
      errorMessage=undefined
    }: { 
      errorMessage?: string 
    }
  ) {
    const manager = this.getManager()
    try {
      yield manager;
    } catch (error) {
      ThrowError({ 
        msg: errorMessage !== undefined ? 
          errorMessage : 'Error executing operation in the database',
        error: error,
      })
    } finally {
    }
  },
}

// Bind all functions in singleton object to avoid bugs by changing context
// of object's functions in the future
Object.values(Database)
  .filter(value => typeof value === 'function')
  .forEach(fn => fn.bind(Database))

export default Database