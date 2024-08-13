import path from 'node:path'
import { defineConfig } from '@playwright/test';

import * as _globals from './globals.mjs';

const globals = _globals as unknown as any
const outputDir = path.resolve('./.run');
const testDir = path.resolve('./test');

export default defineConfig({
  outputDir: outputDir,
  testDir: testDir,
  fullyParallel: false,
  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,
  // Retry on CI or DEBUG only.
  retries: !!process.env.CI && !globals.DEBUG ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : undefined,
});