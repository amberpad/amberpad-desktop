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

export const electronAPI = {
  general: {
    openExternal: (payload: { url: string }) => 
      ipcRenderer.invoke('general.openExternal', payload),
  },
  store: {
    get: (payload: { key: string }) => 
      ipcRenderer.invoke('store:get', payload),
    set: (payload: { key: string, value: any }) => 
      ipcRenderer.invoke('store:set', payload)
  },
  notes: {
    getAll: ((payload) => {
      return ipcRenderer.invoke('notes.getAll', payload)
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
      return ipcRenderer.invoke('notepads.getAll', payload)
    }) as ModelQueryInvokerType<NotepadsFiltersPayloadType, NotepadType>,
    getPages: ((payload: NotepadsPagesFiltersPayloadType) => {
      return ipcRenderer.invoke('notepads.pages.get', payload)
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
      return ipcRenderer.invoke('pages.getAll', payload)
    }) as QueryInvokerType<PagesFiltersPayloadType, {
      values: {
        id: NotepadIDType,
        pages: PageType[]
      }[]
    }>,
    get: ((payload) => {
      return ipcRenderer.invoke('pages.get', payload)
    }) as QueryInvokerType<{ pageID: PageIDType}, { value: PageType & { notepad: NotepadType } }>,
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
  }
}

export type ElectronAPI = typeof electronAPI

contextBridge.exposeInMainWorld('electronAPI', electronAPI)