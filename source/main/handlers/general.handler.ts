import { app, ipcMain, shell } from 'electron'

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
})