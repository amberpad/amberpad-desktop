import { readFileSync} from 'node:fs';
import { resolve } from 'node:path';
import esbuild from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';
//import { EsmExternalsPlugin } from '@esbuild-plugins/esm-externals'
import { copy } from 'esbuild-plugin-copy';
import { clean } from 'esbuild-plugin-clean';
import writeFilePlugin from 'esbuild-plugin-write-file';
//import { builtinModules } from 'node:module';
import escapeStringRegexp from 'escape-string-regexp'
import { writeFile } from 'fs/promises';

import globals from './globals.mjs';

const outDir = './.package';
const pkg = JSON.parse(readFileSync(resolve('./package.json'), { encoding: 'utf8' }));
const isPackaged = globals.ENVIRONMENT === 'production' || 
  (globals.ENVIRONMENT === 'testing' && !globals.DEBUG)

await esbuild.build({
  target: 'node20',
  platform: 'node',
  format: 'esm',
  bundle: true,
  //minify: !!isPackaged,
  sourcemap: !isPackaged,
  logLevel: isPackaged ? 'silent' : "info",
  entryPoints: ["./source/main/main.ts"],
  outfile: resolve(outDir, './main.mjs'),
  tsconfig: './tsconfig.json',
  define: {
    globals: JSON.stringify(globals)
  },
  plugins: [
    {
      name: 'modules-to-pack',
      setup(build) {
        const modulesToPack = new Set()
        const dependencies = {
          ...pkg.devDependencies,
          ...pkg.dependencies,
          ...pkg.peerDependencies,
          ...pkg.optionalDependencies,
        }
        const packagesFilter = new RegExp(
          '^(' + Object.keys(dependencies).map(escapeStringRegexp).join('|') + ')(\\/.*)?$'
        )

        build.onResolve({ namespace: 'file', filter: packagesFilter }, (args) => {
          const module = args.path.split('/')[0]
          modulesToPack.add(module)
          return null
        })

        build.onEnd(() => {
          const toBundle = Array.isArray(pkg.toBundle) ? pkg.toBundle : []
          toBundle.forEach(module => modulesToPack.add(module)) 
          modulesToPack.delete('electron')

          writeFile(resolve(outDir, './package.json'), JSON.stringify({
            main: "main.mjs",
            name: pkg.name,
            version: pkg.version,
            productName: pkg.productName,
            description: pkg.description,
            repository: pkg.repository,
            license: pkg.license,
            author: pkg.author,
            engines: pkg.engines,
            binary: pkg.binary,
            type: pkg.type,
            scripts: {
              "rebuild": "electron-rebuild -f -w better-sqlite3 -m .",
            },
            devDependencies: Object.fromEntries(
              Object.entries(dependencies).filter(([module, _]) => [
                'electron'
              ].some(item => item === module))
            ),
            dependencies: Object.fromEntries(
              Object.entries(dependencies).filter(([module, _]) => [
                ...Array.from(modulesToPack.values())
              ].some(item => item === module))
            ),
          }, null, 2))
        })
      }
    },
    nodeExternalsPlugin(),
    copy({
      assets: [
        {
          from: ['./resources/**/*'],
          to: ['./resources'],
        },
        globals.ENVIRONMENT === 'testing' ? {
          from: ['./playwright/**/*'],
          to: ['./playwright'],
        } : {},
        
        globals.ENVIRONMENT === 'testing' ? {
          from: ['./playwright.config.ts'],
          to: ['./playwright.config.ts'],
        } : {},
        {
          from: globals.ENVIRONMENT === 'testing' ? 
            ['./electron-builder.test.config.js'] : 
            ['./electron-builder.config.js'],
          to: ['./electron-builder.config.js']
        },
      ],
      watch: false,
    }),
    /*
    writeFilePlugin({
      after: {
        [resolve(outDir, './package.json')]: JSON.stringify({
          main: "main.mjs",
          name: pkg.name,
          version: pkg.version,
          productName: pkg.productName,
          description: pkg.description,
          repository: pkg.repository,
          license: pkg.license,
          author: pkg.author,
          engines: pkg.engines,
          binary: pkg.binary,
          type: pkg.type,
          scripts: {
            "rebuild": "electron-rebuild -f -w better-sqlite3 -m .",
          },
          externals: Array.from(modulesToPack.values()),
          dependencies: Object.fromEntries(
            Object.entries({
              ...pkg.devDependencies,
              ...pkg.dependencies,
              ...pkg.peerDependencies,
              ...pkg.optionalDependencies,
            } || {}).filter(([module, _]) => [
              Array.from(modulesToPack.values())
            ].some(item => item === module))
          ),
        }, null, 4)
      }
    }),
    */
    clean({
      cleanOnStartPatterns: [
        './main.mjs',
        './main.mjs.map',
        './resources/',
        './electron-builder.config.js',
        './package.json',
        './playwright/',
        './playwright.config.ts',
      ].map((item) => resolve(outDir, item)),
    }),
  ],
}).catch(() => process.exit(1));