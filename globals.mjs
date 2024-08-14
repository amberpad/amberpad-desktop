import { readFileSync} from 'node:fs';
import { resolve } from 'node:path';
import environment from './environment.mjs';
import settings from './settings.mjs';

const pkg = JSON.parse(readFileSync(resolve('./package.json'), { encoding: 'utf8' }));

export default {
  ...environment,
  ...settings,
  platfrom: process.platform,
  version: pkg.version
}