import { app, ipcMain, nativeTheme } from 'electron'

import store from "@main/utils/electron-store"

function getInitials () {
  nativeTheme.themeSource = store.get('themeSource')
  return {
    theme: {
      theme: nativeTheme.shouldUseDarkColors ? 'dark' : 'light',
      themeSource: nativeTheme.themeSource,
    },
    store: store.store
  }
}

app.on('ready', () => {
  ipcMain.handle('getInitials', getInitials)
})

export type Initials = ReturnType<typeof getInitials>