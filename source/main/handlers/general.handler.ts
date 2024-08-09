import { app, ipcMain, shell , nativeTheme} from 'electron'
import store from "@main/utils/electron-store"


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