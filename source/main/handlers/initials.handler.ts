import { app, ipcMain, nativeTheme } from 'electron'

import store from "@main/utils/electron-store"

function getInitials () {
  return {
    store: store.store
  }
}

app.on('ready', () => {
  ipcMain.handle('getInitials', getInitials)
})

export type Initials = ReturnType<typeof getInitials>