import { app, ipcMain } from 'electron'
import AppUpdater, { CancellationToken } from 'electron-updater'

import type { UpdateInfo } from 'electron-updater'

const { autoUpdater } = AppUpdater 
const cancellationToken = new CancellationToken()
app.on('ready', () => {
  ipcMain.handle('updater.check-for-updates', async (_event, payload): Promise<UpdateInfo | null> => {
    try {
      const result = await autoUpdater.checkForUpdates()
      return result ? result.updateInfo : null
    } catch (error) {
      console.error(error)
      return null
    }
  })
  // @returns {Promise<Array<string>>} Paths to downloaded files.
  ipcMain.handle('updater.download-update', async (_event, payload): Promise<Array<string>> => {
    try {
      return await autoUpdater.downloadUpdate(cancellationToken)
    } catch (error) {
      console.error(error)
      return []
    }
  })
  ipcMain.handle('updater.cancel-download-update', (_event, payload) => {
    try {
      return cancellationToken.cancel()
    } catch (error) {
      console.error(error)
      return
    }
  })
  ipcMain.handle('updater.quit-and-install', (_event, payload) => {
    try {
      return autoUpdater.quitAndInstall()
    } catch (error) {
      console.error(error)
      return
    }

  })
})