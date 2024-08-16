import path from 'node:path'
import fs from 'node:fs'
import { app } from 'electron'
import knex from 'knex'
//import { JSONFilePreset } from 'lowdb/node'
//import { generate as generatePassphrase } from 'generate-passphrase'

import hash from '@main/utils/database/hash'
import { resolveFromRoot, resolveFromUserData } from "@main/utils/locations"
import { ThrowFatalError, ThrowError } from '@main/utils/errors';
import seed from '@main/utils/database/seed'

interface SessionFileContent {
  hash: string
}

/******************************************************************************
 * Set up database constants
 ******************************************************************************/

const DEFAULT_INSECURE_PASSWORD = 'amberpad'

const databaseLocations = {
  'production': resolveFromUserData('amberpad.sqlite'),
  'development' : resolveFromUserData('amberpad.development.sqlite'),
  'testing': process.env.__TESTING_ENVRONMENT_DB_PATH,
}
const databasePath = (
  databaseLocations[globals.ENVIRONMENT] || 
  databaseLocations['production']
)

/******************************************************************************
 * Export database object
 ******************************************************************************/

const Database = {
  queries: undefined,
  status: 'disconnected' as 'connected' | 'disconnected',
  connectKnex: async function (passphrase: string) {
    // Create folder for db if it doesn't exists
    if (!fs.existsSync(path.dirname(databasePath))){
      fs.mkdirSync(path.dirname(databasePath))
    }

    this.queries = knex({
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
          db.pragma(`key='${passphrase}'`);
          fn();
        }
      }
    })

    return this.queries
  },
  _delete: function () {
    try {
      fs.unlinkSync(databasePath)
    } catch (error) {}
  },
  create: async function (passphrase: string = DEFAULT_INSECURE_PASSWORD) {
    if (!this.exists()) {
      try {
        this.queries = await this.connectKnex(passphrase)

        if (await this.testConnection() === false) {
          throw new Error('Connection with db could not been stablished')
        }
        return this.queries
      } catch (error) {
        this._delete()
        ThrowFatalError({ msg: 'Error creating the database', error: error })
      }
    }
  },
  open: async function (passphrase: string = DEFAULT_INSECURE_PASSWORD) {
    if (this.exists()) {
      if (globals.ENVIRONMENT === 'testing') {
        // Override passphrase in testing environment
        passphrase = process.env['__TESTING_ENVRONMENT_DB_PASS']
      }
      await this.connectKnex(passphrase)
      if (await this.testConnection() === false) {
        ThrowFatalError({ msg: 'Unable to connect to the database, the app will be closed' })
      }
      return this.queries
    }
  },
  exists: function () {
    return fs.existsSync(databasePath)
  },
  connect: async function (passphrase: string = DEFAULT_INSECURE_PASSWORD)  {
    if (this.exists()) {
      this.queries = await this.open()
    } else {
      this.queries = await this.create()
    }
    return this.queries;
  },
  applyMigrations: async function () {
    try {
      const dbExistsFlag = fs.existsSync(resolveFromRoot('./resources/migrations'))
      const [version, applied] = await this.queries.migrate.latest({
        directory: resolveFromRoot('./resources/migrations'),
        extension: 'ts',
        tableName: 'knex_migrations'
      })
      const [completed, pending] = await this.queries.migrate.list({
        directory: resolveFromRoot('./resources/migrations'),
        extension: 'ts',
        tableName: 'knex_migrations'
      })

      if (
        !dbExistsFlag &&
        pending.length === 0 &&
        globals.ENVIRONMENT === 'development' &&
        globals.SEED !== undefined && 
        globals.SEED !== null
      ) {

        await seed(this.queries, globals.SEED)
      }
    } catch (error) {
      console.error('There was a problem running migrations in the database', JSON.stringify(error))
      ThrowFatalError({
        msg: 'Unable to set up the database, the app will be closed',
        error: error,
      })
    }
  },
  init: async function () {
    if (this.queries === undefined) {
      this.queries = await this.connect();
    }

    // Run setup migrations
    await this.applyMigrations()

    return this
  },
  destroy: async function () {
    this.queries.destroy();
    this.queries = undefined
    this.destroyContinuiosConnectionTesting();
  },
  testConnection: async function (): Promise<Boolean> {
    try {
      await this.queries.raw('PRAGMA user_version;')
      return true
    } catch (error) {
      return false
    }
  },
  /*
  setUpContinuosConnectionTesting: function () {
    this._heartbeat = this._heartbeat.bind(this)
    this.heartbeatInverval = setInterval(this.heartbeat, 100)
  },
  destroyContinuiosConnectionTesting: function () {
    clearInterval(this.heartbeatInverval)
  },
  _heartbeat: async function () {
    const isConnected = await this.testConnection()
    if (this.status !== 'disconnected' && !isConnected) {
      // DB has been disconnected
    }
    this.status = isConnected ? 'connected' : 'disconnected'
  },
  */
  getManager: async function () {
    if (this.queries === undefined) {
      this.queries = await this.connect();
    }
    return this.queries;
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