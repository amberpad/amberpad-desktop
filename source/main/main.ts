/// <reference path="../globals.d.ts" />

import { app, BrowserWindow, ipcMain } from "electron"
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import checkSquirrelStartup from 'electron-squirrel-startup'
import setAppUpdaterHandlers from './services/appUpdater'
//import log from 'electron-log/main'
//import AppUpdater, { CancellationToken } from 'electron-updater'

import database from '@main/utils/database'
import createMainWindow from '@main/services/mainWindow';
import '@main/handlers/index'

//const { autoUpdater } = AppUpdater 
//autoUpdater.autoDownload = false
//autoUpdater.logger = log;
/* @ts-ignore */
//autoUpdater.logger.transports.file.level = 'info';

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

/*
const cancellationToken = new CancellationToken()
autoUpdater.on('checking-for-update', () => {
  appContext.mainWindow?.webContents.send('updater.checking-for-update')
})
autoUpdater.on('update-available', (info) => {
  appContext.mainWindow?.webContents.send('updater.update-available', info)
})

autoUpdater.on('update-not-available', (info) => {
  appContext.mainWindow?.webContents.send('updater.update-not-available', info)
})
autoUpdater.on('error', (err) => {
  appContext.mainWindow?.webContents.send('updater.error', err)
})
autoUpdater.on('download-progress', (progressObj) => {
  appContext.mainWindow?.webContents.send('updater.download-progress', progressObj)

  //let log_message = "Download speed: " + progressObj.bytesPerSecond;
  //log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  //log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
})
autoUpdater.on('update-downloaded', (info) => {
  appContext.mainWindow?.webContents.send('updater.update-downloaded', info)
})
const setUpdaterMainHandlers = () => {
  ipcMain.handle('updater.check-for-updates',(_event, payload) => {
    autoUpdater.checkForUpdates();
  })
  ipcMain.handle('updater.download-update',(_event, payload) => {
    autoUpdater.downloadUpdate(cancellationToken)
  })
  ipcMain.handle('updater.cancell-download-update',(_event, payload) => {
    cancellationToken.cancel()
  })
  ipcMain.handle('updater.quit-and-install',(_event, payload) => {
    autoUpdater.quitAndInstall();
  })
}
*/

app.whenReady()
  .then(init)
  //.then(setUpdaterMainHandlers)
  .then(() => {
    if (['development'].some((item) => item === globals.ENVIRONMENT)) {
      installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
    }
  })

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
async function init() {
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
  appContext.database.destroy();
}