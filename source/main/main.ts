/// <reference path="../globals.d.ts" />

import { app, BrowserWindow, ipcMain } from "electron"
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import checkSquirrelStartup from 'electron-squirrel-startup'
import setAppUpdaterHandlers from './services/appUpdater'

import database from '@main/utils/database'
import createMainWindow from '@main/services/mainWindow';
import '@main/handlers/index'

var appContext: {
  mainWindow: BrowserWindow,
  database: {[key: string]: any},
} = {
  mainWindow: undefined,
  database: undefined
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (checkSquirrelStartup) {
  destroy();
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    destroy();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    launch()
  }
})

app.whenReady()
  .then(launch)
  .then(() => {
    if (['development'].some((item) => item === globals.ENVIRONMENT)) {
      installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
    }
  })

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
async function launch() {
  let windows = BrowserWindow.getAllWindows();
  if (windows.length === 0) {
    appContext.mainWindow = createMainWindow();
    windows = BrowserWindow.getAllWindows();
  } else {
    windows[0].show();
    windows[0].focus();
  }
  await database.init();
  setAppUpdaterHandlers(appContext.mainWindow)
}

function destroy() {
  app.quit();
  appContext.database?.destroy();
}