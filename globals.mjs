import { readFileSync} from 'node:fs';
import { resolve } from 'node:path';
import environment from './environment.mjs';
import settings from './settings.mjs';

const pkg = JSON.parse(readFileSync(resolve('./package.json'), { encoding: 'utf8' }));

const ENVIRONMENT = settings.ENVIRONMENT || environment.ENVIRONMENT
const DEBUG = settings.DEBUG || environment.DEBUG
export default {
  ...environment,
  ...settings,
  platfrom: process.platform,
  version: pkg.version,
  isPackaged: ENVIRONMENT === 'production'
}
