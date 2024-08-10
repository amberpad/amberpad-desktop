import { app, ipcMain, shell , nativeTheme, BrowserWindow } from 'electron'
import store from "@main/utils/electron-store"


app.on('ready', () => {

  ipcMain.handle(
    'theme.setThemeSource',
    async function (
      event: Electron.IpcMainInvokeEvent,
      payload: { theme: "system" | "light" | "dark" }
    ): Promise<void> {
      nativeTheme.themeSource = payload.theme
      store.set('themeSource', payload.theme)
    }
  )

  nativeTheme.on('updated', (event) => {
    BrowserWindow.getAllWindows().forEach(window => {
      window.webContents.send(
        'theme.onThemeUpdate', 
        nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
      )
    })
  })
})