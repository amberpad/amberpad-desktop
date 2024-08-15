import { app, ipcMain, ipcRenderer, BrowserWindow } from 'electron'
import AppUpdater from 'electron-updater'

export default function setAppUpdaterHandlers (
  mainWindow: BrowserWindow
) {
  const { autoUpdater } = AppUpdater 
  /****************************************************************************
  * Updater listeners for when there is an update
  ****************************************************************************/

  autoUpdater.on('checking-for-update', () => {
    mainWindow?.webContents.send('updater.checking-for-update')
  })
  autoUpdater.on('update-available', (info) => {
    console.info('App updater found an update', info)
    mainWindow?.webContents.send('updater.update-available', info)
  })
  autoUpdater.on('update-not-available', (info) => {
    mainWindow?.webContents.send('updater.update-not-available', info)
  })
  autoUpdater.on('error', (error) => {
    console.error('Error while appliying an update', error)
    mainWindow?.webContents.send('updater.error', error)
  })
  autoUpdater.on('download-progress', (progressObj) => {
    mainWindow?.webContents.send('updater.download-progress', progressObj)
  })
  autoUpdater.on('update-downloaded', (info) => {
    mainWindow?.webContents.send('updater.update-downloaded', info)
  })
}

