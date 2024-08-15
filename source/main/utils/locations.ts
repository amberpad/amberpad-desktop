import path from 'node:path'
import { fileURLToPath } from 'node:url';
import { app } from 'electron'

export function getRootDir () {
  /* @ts-ignore */
  return path.dirname(fileURLToPath(import.meta.url))
}

export function getPreloadEntry () {
  /* @ts-ignore */
  return path.join(path.dirname(fileURLToPath(import.meta.url)), './preload.js')
}

export function getResourcesDir () {
  /* @ts-ignore */
  return path.join(path.dirname(fileURLToPath(import.meta.url)), './resources/')
}

export function resolveFromRoot (...paths: string[]) {
  return path.join(getRootDir(), ...paths)
}

export function resolveFromUserData (...paths: string[]) {
  if (app.isPackaged) {
    return path.join(app.getPath('userData'), ...paths)
  } else {
    return path.join(getRootDir(), '.run', ...paths)
  }

}


