import { app, ipcMain, nativeTheme } from 'electron'

import store from "@main/utils/electron-store"

function getInitials() {
  return {
    theme: {
      theme: nativeTheme.shouldUseDarkColors ? 'dark' : 'light' as 'dark' | 'light',
      themeSource: nativeTheme.themeSource,
    },
    store: store.store
  }
}

export type Initials = ReturnType<typeof getInitials>

export default function setup () {
  nativeTheme.themeSource = store.get('themeSource') || 'system'
  ipcMain.handle('initials.getInitials', getInitials)
}