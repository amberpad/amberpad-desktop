const { series, concurrent, crossEnv } = require("nps-utils");
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path')
const { platform } = require('node:os')

const pkg = JSON.parse(readFileSync(resolve('./package.json'), { encoding: 'utf8' }));
const buildCommand = 'electron-builder build --config electron-builder.config.js --projectDir ./.package'
const platformDict = {
  'darwin': 'mac',
  'win32': 'win',
  'linux': 'linux',
}
const currentPlatform = platformDict[platform]

module.exports = {
  scripts: {
    build: {
      default: currentPlatform === undefined ? '' : series(
        'nps build.prebuild',
        `nps build.icons.${platform()}`,
        ...getPlatformArtifacts(currentPlatform).map(({platform, arch, target}) => 
          `${buildCommand} --${arch} --${platform} ${target}`)
      ),
      //`${buildCommand} --dir --${currentPlatform}`
      debug: crossEnv(
        'AMBERPAD_ENVIRONMENT=development ' +
        'AMBERPAD_DEBUG=true ' + 
        'nps build'
      ),
      darwin: series(
        'nps build.prebuild',
        `nps build.icons.${platform()}`,
        ...getPlatformArtifacts('mac').map(({platform, arch, target}) => 
          `${buildCommand} --${arch} --${platform} ${target}`)
      ),
      win32: series(
        'nps build.prebuild',
        `nps build.icons.${platform()}`,
        ...getPlatformArtifacts('win').map(({platform, arch, target}) => 
          `${buildCommand} --${arch} --${platform} ${target}`)
      ),
      linux: series(
        'nps build.prebuild',
        `nps build.icons.${platform()}`,
        ...getPlatformArtifacts('linux').map(({platform, arch, target}) => 
          `${buildCommand} --${arch} --${platform} ${target}`)
      ),

      main: {
        default: series(
          'nps build.main.esbuild',
          'nps build.main.install'
        ),
        esbuild: 'babel-node main.esbuild.mjs',
        rebuild: 'npm --prefix ./.package run rebuild',
        install: series(
          'npm --prefix ./.package install ./.package',
          'nps build.main.rebuild'
        )
      },
      preload: 'babel-node preload.esbuild.mjs', 
      renderer: 'babel-node renderer.esbuild.mjs',
      prebuild: series(
        'rimraf ./.package',
        'nps build.main',
        'nps build.preload',
        'nps build.renderer',
      ),
      icons: {
        darwin: 'mkdirp ./.package/resources/icons/ && icon-gen -i ./resources/icons/amber.svg -o ./.package/resources/icons/ --icns --icns-name icon --icns-sizes 16,32,64,128,256',
        win32: 'mkdirp ./.package/resources/icons/ && icon-gen -i ./resources/icons/amber.svg -o ./.package/resources/icons/ --ico --ico-name icon --ico-sizes 16,32,64,128,256',
        linux: 'mkdirp ./.package/resources/icons/ && icon-gen -i ./resources/icons/amber.svg -o ./.package/resources/icons/ --icns --icns-name icon --icns-sizes 16,32,64,128,256'
      },
    },
    publish: {
      default: currentPlatform === undefined ? '' : series(
        'nps build.prebuild',
        `nps build.icons.${platform()}`,
        ...getPlatformArtifacts(currentPlatform).map(({platform, arch, target}) => 
          `${buildCommand} -p \"onTagOrDraft\" --${arch} --${platform} ${target}`)
      ),
      darwin: series(
        'nps build.prebuild',
        `nps build.icons.${platform()}`,
        ...getPlatformArtifacts('mac').map(({platform, arch, target}) => 
          `${buildCommand} -p \"onTagOrDraft\" --${arch} --${platform} ${target}`)
      ),
      win32: series(
        'nps build.prebuild',
        `nps build.icons.${platform()}`,
        ...getPlatformArtifacts('win').map(({platform, arch, target}) => 
          `${buildCommand} -p \"onTagOrDraft\" --${arch} --${platform} ${target}`)
      ),
      linux: series(
        'nps build.prebuild',
        `nps build.icons.${platform()}`,
        ...getPlatformArtifacts('linux').map(({platform, arch, target}) => 
          `${buildCommand} -p \"onTagOrDraft\" --${arch} --${platform} ${target}`)
      ),
    },
    test: {
      default: series(
        'nps test.build',
        'nps test.start'
      ),
      build: {
        default: crossEnv(
          'AMBERPAD_ENVIRONMENT=testing ' + 
          'nps build.prebuild'
        ),
        debug: crossEnv(
          'AMBERPAD_ENVIRONMENT=testing ' + 
          'AMBERPAD_DEBUG=true ' +
          'nps build.prebuild'
        ),
      },
      start: {
        default: 'playwright test --config=./playwright.config.ts',
        // Run only the commands that their label is found by a global expression
        grep: 'playwright test --config=./playwright.config.ts -g'
      }
    },
    start: {
      default: series(
        crossEnv(
          'AMBERPAD_ENVIRONMENT=development ' +
          'AMBERPAD_DEBUG=true ' + 
          'nps build.prebuild'
        ),
        concurrent({
          start: 'nps start.electron',
          watch: crossEnv(
            'AMBERPAD_ENVIRONMENT=development ' +
            'AMBERPAD_DEBUG=true ' + 
            'babel-node -- renderer.esbuild.mjs --watch'
          ),
        })
      ),
      electron: 'electron ./.package'
    },

    docker: {
      default: (
        `docker run --rm -ti \\
          --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_') \\
          --env ELECTRON_CACHE="/root/.cache/electron" \\
          --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \\
          -v \${PWD}:/project \\
          -v \${PWD##*/}-node-modules:/project/node_modules \\
          -v ~/.cache/electron:/root/.cache/electron \\
          -v ~/.cache/electron-builder:/root/.cache/electron-builder \\
          electronuserland/builder:wine`
      )
    },
  }, // End of scripts object place new scripts before
};

/*
* Utils
*/

function combineArrays (first, second) {
  const result = []
  for (let i = 0; i < first.length; i++) {
    for (let j = 0; j < second.length; j++) {
      result.push([first[i], second[j]])
    }
  }
  return result
}

function getPlatformArtifacts (platform) {
  const architectures = ((pkg.build || {}).architectures || {})
  const targets = ((pkg.build || {}).targets || {})
  const artifacts = combineArrays(
    (architectures[platform] || []),
    (targets[platform] || []),
  ).map(([arch, target]) => ({platform, arch, target}))
  return artifacts
}