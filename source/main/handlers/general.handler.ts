import { app, ipcMain, shell , nativeTheme} from 'electron'

app.on('ready', () => {
  ipcMain.handle(
    'general.openExternal',
    async function (
      event: Electron.IpcMainInvokeEvent,
      payload: { url: string }
    ): Promise<void> {
      shell.openExternal(payload.url)
    }
  )

  ipcMain.handle(
    'initials.defaultTheme',
    function () {
      return nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
    }
  )
})