/// <reference path="../globals.d.ts" />

import { app, BrowserWindow, ipcMain, Menu } from "electron"
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import checkSquirrelStartup from 'electron-squirrel-startup'
import setAppUpdaterHandlers from './services/appUpdater'
import AppUpdater from 'electron-updater'
import log from 'electron-log/main.js'

import database from '@main/utils/database'
import { resolveFromUserData } from '@main/utils/locations'
import createMainWindow from '@main/services/mainWindow'
import buildMenuTemplate from "./services/buildMenuTemplate"
import { ThrowFatalError, ThrowError } from '@main/utils/errors';
// Handlers
import initialsHandlers from "./handlers/initials.handler"
import generalHandlers from '@main/handlers/general.handler'
import storesHandlers from '@main/handlers/store.handler'
import notepadsHandlers from '@main/handlers/notepads.handler'
import pagesHandlers from '@main/handlers/pages.handler'
import notesHandlers from '@main/handlers/notes.handler'
import updaterHandlers from '@main/handlers/updater.handler'
import themeHandlers from '@main/handlers/theme.handler'

const context: {
  mainWindow: BrowserWindow,
  database: {[key: string]: any},
} = {
  mainWindow: undefined,
  database: undefined
}

// Updater settings
const { autoUpdater } = AppUpdater 
autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = false
autoUpdater.autoRunAppAfterInstall = true
autoUpdater.logger = ['testing'].includes(globals.ENVIRONMENT) ? null : console

// Logger settings
const loggerFileLocations = {
  'production': resolveFromUserData('./logs/main.log'),
  'development': resolveFromUserData('./logs/main.log'), 
  'testing': process.env.__TESTING_ENVRONMENT_LOG_PATH,
}

// Log leves: error, warn, info, verbose, debug, silly
const logLevel = globals.DEBUG ? globals.LOG_LEVEL : 'info';
log.initialize();
log.transports.console.level = logLevel;
log.transports.file.level = logLevel;
log.transports.file.maxSize = 10 * 1048576 // unit 1mb
log.transports.file.resolvePathFn = () => 
  loggerFileLocations[globals.ENVIRONMENT] || 
  loggerFileLocations['production'];

// assign log functions to console module
Object.assign(console, log.functions);


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (checkSquirrelStartup) {
  destroy();
}

const menu = Menu.buildFromTemplate(buildMenuTemplate())
Menu.setApplicationMenu(menu)

/****************************************************************************** 
* App listeners
******************************************************************************/

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    destroy();
  }
});

app.on('before-quit', () => {
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    launch()
  }
})

app.whenReady()
  .then(() => console.info('Starting the application...'))
  .then(() => setHandlers())
  .catch((error) => {
    console.error(`There was an error launching the app: ${JSON.stringify(error)}`)
  })
  .then(async () => await launch())
  .catch((error) => {
    console.error(`There was an error launching the app: ${JSON.stringify(error)}`)
  })
  .then(() => {
    globals.ENVIRONMENT === 'development' && 
    globals.DEBUG && 
    /* @ts-ignore */
    installExtension.default(REACT_DEVELOPER_TOOLS)
      .then((name) => console.info(`electron-dev-tools: Added Extension:  ${name}`))
      .catch((err) => console.info(`electron-dev-tools: An error occurred: ${err}`));
  }).catch((error) => {
    console.error(`There was an error launching the app: ${JSON.stringify(error)}`)
    ThrowFatalError({
      msg: `There was an error launching the app`,
      error: error,
    })
    app.quit()
  })

/****************************************************************************** 
* Setup functions
******************************************************************************/

function setHandlers () {
  initialsHandlers()
  generalHandlers()
  storesHandlers()
  notepadsHandlers()
  pagesHandlers()
  notesHandlers()
  updaterHandlers()
  themeHandlers()
}

async function launch() {
  let windows = BrowserWindow.getAllWindows();
  if (windows.length === 0) {
    context.mainWindow = createMainWindow();
    windows = BrowserWindow.getAllWindows();
  } else {
    windows[0].show();
    windows[0].focus();
  }
  await database.init();
  setAppUpdaterHandlers(context.mainWindow);
}

function destroy() {
  app.quit();
  context.database?.destroy();
}
