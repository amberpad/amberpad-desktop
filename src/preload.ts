// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'

import type { 
  QueryInvoker,
  ModelQueryInvoker, 
  ModelCreateInvoker, 
  ModelUpdateInvoker, 
  ModelDestroyInvoker 
} from '@ts/invokers.types'
import type { NotePayload, Note, NoteFiltersPayload } from '@ts/models/Notes.types'
import type { PagePayload, Page, PageFiltersPayload, PageID } from '@ts/models/Pages.types'
import type { NotepadPayload, Notepad, NotepadFiltersPayload, NotepadID } from '@ts/models/Notepads.types'

export const electronAPI = {
  commons: {},
  settings: {
    sidebarAperture: {
      get: () => 
        ipcRenderer.invoke('settings.sidebarAperture:get'),
      set: (payload: { sidebarAperture: number }) => 
        ipcRenderer.invoke('settings.sidebarAperture:set', payload)
    },
    selectedPageID: {
      get: () => 
        ipcRenderer.invoke('settings.selectedPageID:get'),
      set: (payload: { selectedPageID: PageID }) => 
        ipcRenderer.invoke('settings.selectedPageID:set', payload)
    },
  },
  notes: {
    getAll: ((payload) => {
      return ipcRenderer.invoke('database.notes:getAll', payload)
    }) as ModelQueryInvoker<NoteFiltersPayload, Note>,
    create: ((payload) => {
      return ipcRenderer.invoke('database.notes:create', payload)
    }) as ModelCreateInvoker<NotePayload, Note>,
    update: ((payload) => {
      return ipcRenderer.invoke('database.note:update', payload)
    }) as ModelUpdateInvoker<Note>,
    destroy: ((payload) => {
      return ipcRenderer.invoke('database.notes:destroy', payload)
    }) as ModelDestroyInvoker<Note>,
  },
  notepads: {
    getAll: ((payload: NotepadFiltersPayload) => {
      return ipcRenderer.invoke('database.notepads:getAll', payload)
    }) as ModelQueryInvoker<NotepadFiltersPayload, Notepad>,
    create: ((payload) => {
      return ipcRenderer.invoke('database.notepads:create', payload)
    }) as ModelCreateInvoker<NotepadPayload, Notepad>,
    update: ((payload) => {
      return ipcRenderer.invoke('database.notepads:update', payload)
    }) as ModelUpdateInvoker<Notepad>,
    destroy: ((payload) => {
      return ipcRenderer.invoke('database.notepads:destroy', payload)
    }) as ModelDestroyInvoker<Notepad>,
  },
  pages: {
    getAll: ((payload: PageFiltersPayload) => {
      return ipcRenderer.invoke('database.pages:getAll', payload)
    }) as QueryInvoker<PageFiltersPayload, {
      values: {
        notepadId: NotepadID,
        pages: Page[]
      }[]
    }>,
    create: ((payload) => {
      return ipcRenderer.invoke('database.pages:create', payload)
    }) as ModelCreateInvoker<PagePayload, Page>,
    update: ((payload: { value: Page }) => {
      return ipcRenderer.invoke('database.pages:update', payload)
    }) as ModelUpdateInvoker<Page>,
    destroy: ((payload) => {
      return ipcRenderer.invoke('database.pages:destroy', payload)
    }) as ModelDestroyInvoker<Page>,
  }
}

export type ElectronAPI = typeof electronAPI

contextBridge.exposeInMainWorld('electronAPI', electronAPI)