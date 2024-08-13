import path from 'node:path'
import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import { app } from 'electron'
import { generate } from 'generate-passphrase'
import * as argon2 from 'argon2'

const SALT = Buffer.from('t6BkSeQz0t')

const sessionLocations = {
  'production': path.resolve(app.getPath('userData'), 'session'),
  'development' : path.resolve('.run/session'), 
  'testing': path.resolve('.run/session'),
}

const sessionLocation = (
  sessionLocations[globals.ENVIRONMENT] || 
  sessionLocations['production']
)

/*
  Usage:
    let session = await dbSession.get()
    if (!session) {
      const passphrase = await dbSession.generatePassphrase()
      session = await dbSession.create(passphrase)
    }
*/

export default {
  generatePassphrase: async (): Promise<string> => {
    return generate()
  },
  create: async (passphrase: string, force: boolean=false): Promise<{ hash: string }> => {
    const sessionFileContent = {
      hash: (await argon2.hash(passphrase, { type: argon2.argon2i, salt: SALT })).toString()
    }

    if (fs.existsSync(sessionLocation) && !force) {
      throw('There is already a session file, if you want to override it use param force true')
    }

    try {
      fs.writeFileSync(sessionLocation, JSON.stringify(sessionFileContent))
      return sessionFileContent
    } catch(error) {
      console.error('There was a problem creating the database session')
    }
  },
  get: async (): Promise<{ hash: string } | null> => {
    if (fs.existsSync(sessionLocation)) {
      try {
        return JSON.parse(fs.readFileSync(sessionLocation).toString())
      } catch(error) {
        console.error('There was a problem creating the database session')
      }
    }
    return null
  }
}