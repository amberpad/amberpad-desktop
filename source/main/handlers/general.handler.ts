import { app, ipcMain, shell , nativeTheme} from 'electron'
import store from "@main/utils/electron-store"

export default function setup () {
  ipcMain.handle(
    'general.openExternal',
    async function (
      event: Electron.IpcMainInvokeEvent,
      payload: { url: string }
    ): Promise<void> {
      shell.openExternal(payload.url)
    }
  )
}