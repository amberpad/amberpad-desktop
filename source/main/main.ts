/// <reference path="../globals.d.ts" />

import { app, BrowserWindow, ipcMain, Menu } from "electron"
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import checkSquirrelStartup from 'electron-squirrel-startup'
import setAppUpdaterHandlers from './services/appUpdater'
import AppUpdater from 'electron-updater'

import database from '@main/utils/database'
import createMainWindow from '@main/services/mainWindow';
import buildMenuTemplate from "./services/buildMenuTemplate"
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
  .then(setHandlers)
  .then(launch)
  .then(() => {
    if (globals.DEBUG) {
      installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
    }
  })

/****************************************************************************** 
* Setup functions
******************************************************************************/

async function setHandlers () {
  await initialsHandlers()
  await generalHandlers()
  await storesHandlers()
  await notepadsHandlers()
  await pagesHandlers()
  await notesHandlers()
  await updaterHandlers()
  await themeHandlers()
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
