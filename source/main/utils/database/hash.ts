import * as argon2 from 'argon2'

const SALT = Buffer.from('t6BkSeQz0t')

export default async function hash(passphrase: string) {
  const bytes = await argon2.hash(
    passphrase, 
    { 
      type: argon2.argon2i, 
      salt: SALT, 
      raw: true 
    }
  )
  return bytes.toString('hex')
}