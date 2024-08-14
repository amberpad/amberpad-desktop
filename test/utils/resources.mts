import path from 'node:path'
import { fileURLToPath } from 'node:url';

export function getRootDir () {
  return path.dirname(fileURLToPath(import.meta.url))
}

export function getResourcesDir () {
  return path.join(getRootDir(), './resources/')
}