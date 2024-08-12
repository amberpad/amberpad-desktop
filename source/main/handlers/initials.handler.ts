import { app, ipcMain, nativeTheme } from 'electron'

import store from "@main/utils/electron-store"

function getInitials(_, payload) {
  return {
    theme: {
      theme: nativeTheme.shouldUseDarkColors ? 'dark' : 'light' as 'dark' | 'light',
      themeSource: nativeTheme.themeSource,
    },
    store: store.store
  }
}

app.on('ready', () => {
  nativeTheme.themeSource = store.get('themeSource')
  ipcMain.handle('initials.getInitials', getInitials)
})

export type Initials = ReturnType<typeof getInitials>