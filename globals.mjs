import environment from './environment.mjs';
import settings from './settings.mjs';

export default {
  ...environment,
  ...settings,
  platfrom: process.platform,
}