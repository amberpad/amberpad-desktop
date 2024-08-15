import path from 'node:path'
import { fileURLToPath } from 'node:url';
import { app } from 'electron'

export function getPackedRootDir () {
  /* @ts-ignore */
  return path.dirname(fileURLToPath(import.meta.url))
}

export function getSourceRootDir () {
  return path.resolve('.')
}

export function getPreloadEntry () {
  /* @ts-ignore */
  return path.join(getPackedRootDir(), './preload.js')
}

export function getResourcesDir () {
  /* @ts-ignore */
  return path.join(getPackedRootDir(), './resources/')
}

export function resolveFromRoot (...paths: string[]) {
  return path.join(getPackedRootDir(), ...paths)
}

export function resolveFromUserData (...paths: string[]) {
  if (app.isPackaged) {
    return path.join(app.getPath('userData'), ...paths)
  } else {
    return path.join(getSourceRootDir(), '.run', ...paths)
  }

}


