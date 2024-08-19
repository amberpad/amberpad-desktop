// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'

import type { 
  QueryInvokerType,
  ModelQueryInvokerType, 
  ModelCreateInvokerType, 
  ModelUpdateInvokerType, 
  ModelDestroyInvokerType 
} from '@ts/invokers.types'
import type { 
  NotePayloadType, 
  NoteType, 
  NotesFiltersPayloadType 
} from 'ts/models/Notes.types'
import type { 
  PagePayloadType, 
  PageType, 
  PagesFiltersPayloadType, 
  PageIDType 
} from '@ts/models/Pages.types'
import type { 
  NotepadPayloadType, 
  NotepadType, 
  NotepadsFiltersPayloadType, 
  NotepadsPagesFiltersPayloadType, 
  NotepadIDType
} from '@ts/models/Notepads.types'
import { UpdateInfo, UpdateDownloadedEvent, ProgressInfo } from 'electron-updater'
import { Initials } from '@main/handlers/initials.handler'

export const electronAPI = {
  /**************************************************************************** 
  *  Initial values
  ****************************************************************************/
  getInitials: (): Promise<Initials> => {
    return ipcRenderer.invoke('initials.getInitials')
  },
  
  /**************************************************************************** 
  *  Commands
  ****************************************************************************/
  general: {
    openExternal: (payload: { url: string }) => 
      ipcRenderer.invoke('general.openExternal', payload),
  },
  theme: {
    onThemeUpdate: (
      callback: (payload: 'dark' | 'light') => void
    ) => {
      return ipcRenderer.on('theme.onThemeUpdate', (_event, payload) => callback(payload))
    },
    setThemeSource: (payload: { theme: "system" | "light" | "dark" }) => 
      ipcRenderer.invoke('theme.setThemeSource', payload),
  },
  store: {
    get: (payload: { key: string }) => 
      ipcRenderer.invoke('store.get', payload),
    set: (payload: { key: string, value: any }) => 
      ipcRenderer.invoke('store.set', payload),
    getAll: () => ipcRenderer.invoke('store.getAll'),
  },
  notes: {
    getAll: ((payload) => {
      return ipcRenderer.invoke('notes.get-all', payload)
    }) as ModelQueryInvokerType<NotesFiltersPayloadType, NoteType>,
    create: ((payload) => {
      return ipcRenderer.invoke('notes.create', payload)
    }) as ModelCreateInvokerType<NotePayloadType, NoteType>,
    update: ((payload) => {
      return ipcRenderer.invoke('note.update', payload)
    }) as ModelUpdateInvokerType<NoteType>,
    destroy: ((payload) => {
      return ipcRenderer.invoke('notes.destroy', payload)
    }) as ModelDestroyInvokerType<NoteType>,
  },
  notepads: {
    getAll: ((payload: NotepadsFiltersPayloadType) => {
      return ipcRenderer.invoke('notepads.get-all', payload)
    }) as ModelQueryInvokerType<NotepadsFiltersPayloadType, NotepadType>,
    getPages: ((payload: NotepadsPagesFiltersPayloadType) => {
      return ipcRenderer.invoke('notepads.pages.all', payload)
    }) as QueryInvokerType<NotepadsPagesFiltersPayloadType, {
      values: {
        id: NotepadIDType,
        pages: PageType[]
      }[]
    }>,
    create: ((payload) => {
      return ipcRenderer.invoke('notepads.create', payload)
    }) as ModelCreateInvokerType<NotepadPayloadType, NotepadType>,
    update: ((payload) => {
      return ipcRenderer.invoke('notepads.update', payload)
    }) as ModelUpdateInvokerType<NotepadType>,
    destroy: ((payload) => {
      return ipcRenderer.invoke('notepads.destroy', payload)
    }) as ModelDestroyInvokerType<NotepadType>,
  },
  pages: {
    getAll: ((payload: PagesFiltersPayloadType) => {
      return ipcRenderer.invoke('pages.get-all', payload)
    }) as QueryInvokerType<PagesFiltersPayloadType, {
      values: {
        id: NotepadIDType,
        pages: PageType[]
      }[]
    }>,
    get: ((payload) => {
      return ipcRenderer.invoke('pages.get', payload)
    }) as QueryInvokerType<{ id: PageIDType}, { value: PageType & { notepad: NotepadType } }>,
    create: ((payload) => {
      return ipcRenderer.invoke('pages.create', payload)
    }) as ModelCreateInvokerType<PagePayloadType, PageType>,
    update: ((payload: { value: PageType }) => {
      return ipcRenderer.invoke('pages.update', payload)
    }) as ModelUpdateInvokerType<PageType>,
    destroy: ((payload) => {
      return ipcRenderer.invoke('pages.destroy', payload)
    }) as ModelDestroyInvokerType<PageType>,
    moveTop: ((payload: { value: PageIDType }): Promise<boolean> => {
      return ipcRenderer.invoke('pages.moveTop', payload)
    }),
  },
  updater: {
    onCheckingForUpdate: (
      callback: () => void
    ) => {
      return ipcRenderer.on(`updater.checking-for-update`, (_event, payload) => callback())
    },
    onUpdateAvailable: (
      callback: (payload: UpdateInfo) => void
    ) => {
      return ipcRenderer.on(`updater.update-available`, (_event, payload) => callback(payload))
    },
    onUpdateNotAvailable: (
      callback: (payload: UpdateInfo) => void
    ) => {
      return ipcRenderer.on(`updater.update-not-available`, (_event, payload) => callback(payload))
    },
    onError: (
      callback: (payload: Error) => void
    ) => {
      return ipcRenderer.on(`updater.error`, (_event, payload) => callback(payload))
    },
    onDownloadProgress: (
      callback: (payload: ProgressInfo) => void
    ) => {
      return ipcRenderer.on(`updater.download-progress`, (_event, payload) => callback(payload))
    },
    onUpdateDownloaded: (
      callback: (payload: UpdateDownloadedEvent) => void
    ) => {
      return ipcRenderer.on(`updater.update-downloaded`, (_event, payload) => callback(payload))
    },
    
    checkForUpdates: (): Promise<UpdateInfo | null> => {
      return ipcRenderer.invoke('updater.check-for-updates')
    },
    // @returns {Promise<Array<string>>} Paths to downloaded files.
    downloadUpdate: (): Promise<Array<string>> => {
      return ipcRenderer.invoke('updater.download-update')
    },
    cancelDownloadUpdate: (): Promise<void> => {
      return ipcRenderer.invoke('updater.cancel-download-update')
    },
    quitAndInstall: (): Promise<void> => {
      return ipcRenderer.invoke('updater.quit-and-install')
    },
  }
}

export type ElectronAPI = typeof electronAPI
contextBridge.exposeInMainWorld('electronAPI', electronAPI)
