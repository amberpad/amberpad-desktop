import path from 'node:path'
import fs from 'node:fs'
import { app } from 'electron'
import knex from 'knex'

import dbSession from "@main/utils/database/session"
import { getResourcesDir, getRootDir } from "@main/utils/resources"
import { ThrowFatalError, ThrowError } from '@main/utils/errors';
import seed from '@main/utils/database/seed'

/******************************************************************************
 * Set up database location
 ******************************************************************************/

const databaseLocations = {
  'production': path.resolve(app.getPath('userData'), 'amberpad.db'),
  'development' : path.resolve('.run/amberpad.development.db'), 
  'testing': path.resolve('.run/amberpad.test.db'),
}
const databasePath = (
  process.env.__TESTING_ENVRONMENT_DB_PATH ||  
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
      debug: globals.DEBUG,
      useNullAsDefault: true,
      connection: {
        filename: databasePath,
        options: {
          // note: we need this in order to use encryption
          nativeBinding: path.join(
            getRootDir(),
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
      await this.queriesManager.migrate.up({
        directory: path.resolve(getResourcesDir(), './migrations'),
        extension: 'ts',
        tableName: 'knex_migrations'
      })

      if (
        globals.ENVIRONMENT === 'development' && 
        globals.SEED !== undefined && 
        globals.SEED !== null
      ) {
        seed(this.queriesManager, globals.SEED)
      }
    } catch (error) {
      ThrowFatalError({
        content: 'Unable to set up the database, the app will be closed',
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
      ThrowFatalError({
        content: 'Unable to connect to the database, the app will be closed',
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
        content: errorMessage !== undefined ? 
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