/// <reference path="../globals.d.ts" />

import util from 'node:util';
import { app, BrowserWindow, ipcMain, Menu } from "electron"
//import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import checkSquirrelStartup from 'electron-squirrel-startup'
import setAppUpdaterHandlers from './services/appUpdater'
import AppUpdater from 'electron-updater'
import log from 'electron-log/main.js'

//import database from '@main/utils/database'
import database from '@main/utils/database';
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
import chalk from "chalk"

if (globals.ENVIRONMENT !== 'production') {
  import('source-map-support/register.js')
}


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
/* @ts-ignore */
log.transports.console.format = ({ data, level, message }) => {
  const text = util.format(...data);
  return [ 
    message.date.toISOString().slice(11, -1),
    `[${level}]`,
    text
  ].map(item => level === 'error' ? chalk.red(item) : item)
}
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
  .then(async () => await setUpDatabase())
  .then(() => setHandlers())
  .catch((error) => {
    ThrowFatalError({ msg: `Error while setting up handlers in main thread`, error })
  })
  .then(async () => await launch())
  .catch((error) => {
    ThrowFatalError({ msg: `Error while launcing the app`, error })
  })
  /*
  .then(() => {
    globals.ENVIRONMENT === 'development' && 
    globals.DEBUG && 
    installExtension.default(REACT_DEVELOPER_TOOLS)
      .then((name) => console.info(`electron-dev-tools: Added Extension:  ${name}`))
      .catch((err) => console.error(`electron-dev-tools: An error occurred: ${err}`));
  })
  */

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
  setAppUpdaterHandlers(context.mainWindow);
}

async function setUpDatabase () {
  if (!database.exists()) {
    await database.create();
  }
  await database.connect();
}

async function launch() {

  // Launch main window 
  let windows = BrowserWindow.getAllWindows();
  if (windows.length === 0) {
    context.mainWindow = createMainWindow();
    windows = BrowserWindow.getAllWindows();
  } else {
    windows[0].show();
    windows[0].focus();
  }
}

function destroy() {
  app.quit();
  context.database?.destroy();
}
