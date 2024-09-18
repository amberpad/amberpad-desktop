const { readFileSync } = require('node:fs');
const { resolve } = require('node:path')

const pkg = JSON.parse(readFileSync(resolve('./package.json'), { encoding: 'utf8' }));

module.exports = {
  appId: pkg.name,
  productName: pkg.productName,
  asar: true,
  npmRebuild: true,
  artifactName: '${productName}-${version}-${arch}.${ext}',
  directories: {
    output: "distribution/"
  },
  publish: [{
    provider: "github",
    owner: "amberpad",
    repo: "amberpad-desktop"
  }],
  
  linux: {
    icon: "./resources/icons/icon.icns", // Build icons in .png format from icon.icns file
    category: "Utility",
    synopsis: pkg.package,
    desktop: {
      Name: pkg.productName,
      Type: "Application",
      Comment: pkg.description,
      Terminal: "false"
    }
  },
  mac: {
    category: "public.app-category.productivity",
    darkModeSupport: false,
    // entitlements: "./resources/mac/entitlements.plist",
    //entitlementsInherit: "./resources/mac/entitlements.plist",
    gatekeeperAssess: false,
    hardenedRuntime: true,
    icon: "./resources/icons/icon.icns",
    artifactName: '${productName}-${version}.${ext}',
    //notarize: { "teamId": "" }
  },
  win: {
    icon: "./resources/icons/icon.ico",
    publisherName: pkg.author.name,
  },
};
