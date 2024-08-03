import { app, ipcMain } from 'electron'
import AppUpdater, { CancellationToken } from 'electron-updater'

import type { UpdateInfo } from 'electron-updater'

const { autoUpdater } = AppUpdater 
const cancellationToken = new CancellationToken()
app.on('ready', () => {
  ipcMain.handle('updater.check-for-updates', async (_event, payload): Promise<UpdateInfo | null> => {
    const result = await autoUpdater.checkForUpdates()
    return result ? result.updateInfo : null
  })
  // @returns {Promise<Array<string>>} Paths to downloaded files.
  ipcMain.handle('updater.download-update', async (_event, payload): Promise<Array<string>> => {
    return await autoUpdater.downloadUpdate(cancellationToken)
  })
  ipcMain.handle('updater.cancel-download-update', (_event, payload) => {
    return cancellationToken.cancel()
  })
  ipcMain.handle('updater.quit-and-install', (_event, payload) => {
    return autoUpdater.quitAndInstall();
  })
})