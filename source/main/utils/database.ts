import path from 'node:path'
import fs from 'node:fs'
import knex from 'knex'
import lodash from 'lodash'

import hash from '@main/utils/database/hash'
import { resolveFromRoot, resolveFromUserData } from "@main/utils/locations"
import { ThrowFatalError, ThrowError } from '@main/utils/errors';
import seed from '@main/utils/database/seed'


/******************************************************************************
* Interfaces
******************************************************************************/

interface DatabaseHelpers {
  //get: () => void
  //all: () => void
  create: <Payload=any, Return=any>(
    table: string, 
    payload: Payload[]
  ) => Promise<Return[]>
  delete: () => void
  update: () => void

  getColumns: (
    table: string
  ) => Promise<string[]>
}

interface DatabaseManager {
  queries: knex.Knex<any, unknown[]>
  currentTransaction: knex.Knex.Transaction<any, any[]>
  _connectKnex: (passphrase: string) => DatabaseManager['queries']
  _delete: () => void
  exists: () => boolean
  create: (passphrase?: string) => Promise<DatabaseManager['queries']>
  testConnection: () => Promise<boolean>
  getConnection: () => Promise<DatabaseManager['queries']>
  connect: (passphrase?: string) => Promise<DatabaseManager['queries']>
  destroy: () => void
  applyMigrations: (options?: { applySeed?: boolean }) => Promise<void>
  withConnection: () => AsyncGenerator<DatabaseManager['queries'], void, unknown>
  helpers: DatabaseHelpers
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
* Database object
******************************************************************************/

const context: Partial<DatabaseManager> = {
}

context._connectKnex = (passphrase) => {
  const instance = knex({
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
        // note: this code is needed in order to use encryption
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

  context.queries = instance
  return instance
}

context._delete = () => {
  try {
    fs.unlinkSync(databasePath)
  } catch (error) {}
}

context.create = async (
  passphrase = DEFAULT_INSECURE_PASSWORD
) => {
  if (!context.exists()) {
    try {
      context.queries = await context._connectKnex(passphrase)

      if (await context.testConnection() === false) {
        throw new Error('Connection with db could not been stablished')
      }

      // Apply migrations
      await context.applyMigrations({ applySeed: true })

      return context.queries
    } catch (error) {
      context._delete()
      ThrowFatalError({ msg: 'Error creating the database', error: error })
    }
  }
}

context.exists = () => {
  return fs.existsSync(databasePath)
}

context.connect = async (
  passphrase = DEFAULT_INSECURE_PASSWORD
) => {
  if (await context.testConnection() === true) {
    return context.queries
  }

  if (context.exists()) {
    if (globals.ENVIRONMENT === 'testing') {
      // Override passphrase in testing environment
      passphrase = process.env['__TESTING_ENVRONMENT_DB_PASS']
    }
    context._connectKnex(passphrase)
    if (await context.testConnection() === false) {
      ThrowFatalError({ msg: 'Unable to connect to the database, the app will be closed' })
    }

    // Apply migrations
    await context.applyMigrations()
    return context.queries
  }
}

context.testConnection = async () => {
  try {
    if (
      context.queries === undefined || 
      context.queries === null
    ) {
      return false
    }
    await context.queries.raw('PRAGMA user_version;')
    return true
  } catch (error) {
    console.error('Text connection error:', error)
    return false
  }
},

context.getConnection = async () => {
  if (!context.exists()) {
    console.error('A database to connect with doesn\' exist')
  }
  if (context.exists() && !await context.testConnection()) {
    console.error('There is no database connection available')
  }

  return context.queries
}

context.withConnection = async function* () {
  const connection = await context.getConnection()
  const transaction = await connection.transaction()
  const transactionRef = { commit: true}
  try {
    context.currentTransaction = transaction
    yield transaction;
  } catch (error) {
    ThrowError({ msg: 'Error accessing the database', error })
    transactionRef.commit = false
  } finally {
    transactionRef.commit ? 
      transaction.commit() :
      transaction.rollback()
    context.currentTransaction = undefined
  }
}
context.withConnection.bind(context)

context.destroy = async () => {
  context.queries.destroy();
  context.queries = undefined
}

context.applyMigrations = async (options={  applySeed: false }) => {
  if (!context.exists() || !await context.testConnection()) {
    console.error('There must exit a database connection to apply migrations')
    return
  }

  try {
    const [version, applied] = await context.queries.migrate.latest({
      directory: resolveFromRoot('./resources/migrations'),
      extension: 'ts',
      tableName: 'knex_migrations'
    })
    const [completed, pending] = await context.queries.migrate.list({
      directory: resolveFromRoot('./resources/migrations'),
      extension: 'ts',
      tableName: 'knex_migrations'
    })

    if (
      options.applySeed &&
      pending.length === 0 &&
      globals.ENVIRONMENT === 'development' &&
      globals.SEED !== undefined && 
      globals.SEED !== null
    ) {
      await seed(context.queries, globals.SEED)
    }
  } catch (error) {
    console.error('There was a problem running migrations in the database', JSON.stringify(error))
    ThrowFatalError({
      msg: 'Unable to set up the database, the app will close',
      error: error,
    })
  }
}

/******************************************************************************
* Helpers
******************************************************************************/

context.helpers = {} as DatabaseHelpers

context.helpers.getColumns = async (table) => {
  const manager = context.currentTransaction || context.queries
  if (manager === undefined || manager === null) {
    console.error('Database must be open to use this helper')
  }
  return Object.keys(await manager(table).columnInfo())
}

context.helpers.create = async (table, payload) => {
  for await (const queries of context.withConnection()) {
    const columns = await context.helpers.getColumns(table)
    const data = await queries(table)
      .returning('*')
      .insert(payload.map(item => lodash.pick(item, columns)))
    return data as any[]
  }
}

/******************************************************************************
* Exports
******************************************************************************/

/*
    if (this.exists()) {
      this.queries = await this.open()
    } else {
      this.queries = await this.create()
    }
*/

export default {
  ...context
} as DatabaseManager