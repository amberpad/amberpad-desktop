import { app, ipcMain, nativeTheme } from 'electron'

import store from "@main/utils/electron-store"
import * as notesQueries from '@main/queries/notes'

async function getInitials() {
  return {
    theme: {
      theme: nativeTheme.shouldUseDarkColors ? 'dark' : 'light' as 'dark' | 'light',
      themeSource: nativeTheme.themeSource,
    },
    store: store.store,
    notes: await notesQueries.getAll({ pageID: store.get('selectedPageID') })
  }
}

export type Initials = Awaited<ReturnType<typeof getInitials>>

export default function setup () {
  nativeTheme.themeSource = store.get('themeSource') || 'system'
  ipcMain.handle('initials.getInitials', getInitials)
}