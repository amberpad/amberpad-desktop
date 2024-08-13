import { app, ipcMain, BrowserWindow } from 'electron'
import AppUpdater, { CancellationToken } from 'electron-updater'
import util from 'node:util'

import type { UpdateInfo } from 'electron-updater'

const { autoUpdater } = AppUpdater 

const cancellationToken = new CancellationToken()
app.on('ready', () => {
  ipcMain.handle('updater.check-for-updates', async (_event, payload): Promise<UpdateInfo | null> => {
    try {
      const result = await autoUpdater.checkForUpdates()
      return result ? result.updateInfo : null
    } catch (error) {
      globals.DEBUG && console.error(error)
      return null
    }
  })
  // @returns {Promise<Array<string>>} Paths to downloaded files.
  ipcMain.handle('updater.download-update', async (_event, payload): Promise<Array<string>> => {
    try {
      return await autoUpdater.downloadUpdate(cancellationToken)
    } catch (error) {
      globals.DEBUG && console.error(error)
      return []
    }
  })
  ipcMain.handle('updater.cancel-download-update', (_event, payload) => {
    try {
      return cancellationToken.cancel()
    } catch (error) {
      globals.DEBUG && console.error(error)
      return
    }
  })
  ipcMain.handle('updater.quit-and-install', async (_event, payload) => {    
    try {
      let windows = BrowserWindow.getAllWindows();
      windows.forEach(window => {
        window.setMovable(false)
        window.setResizable(false)
        window.setEnabled(false)
        window.setFullScreenable(false)
        window.setMinimizable(false)
        window.setMaximizable(false)
        window.setProgressBar(0.5)
        window.setHasShadow(true)
        window.setIgnoreMouseEvents(true)
        window.removeMenu()
      })
      autoUpdater.quitAndInstall(true, true)
      return 
    } catch (error) {
      globals.DEBUG && console.error(error)
      return
    }

  })
})
