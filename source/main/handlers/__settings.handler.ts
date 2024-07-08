import settings from '@main/utils/electron-store'
import { app, ipcMain } from 'electron'

import { ThrowError } from '@main/utils/errors'
import { PageIDType } from '@ts/models/Pages.types'

app.on('ready', () => {
  ipcMain.handle(
    'settings.sidebarAperture:get',
    async function (
      event: Electron.IpcMainInvokeEvent
    ): Promise<number> {
      try {
        return settings.get('sidebarAperture') as number
      } catch (error) {
        ThrowError({ 
          content: 'Error syncing settings',
          error: error,
        })
      }
    }
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'settings.sidebarAperture:set',
    async function (
      event: Electron.IpcMainInvokeEvent,
      payload: { sidebarAperture: string }
    ): Promise<any> {
      try {
        return settings.set('sidebarAperture', payload.sidebarAperture)
      } catch (error) {
        ThrowError({ 
          content: 'Error syncing settings',
          error: error,
        })
      }
    }
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'settings.selectedPageID:get',
    async function (
      event: Electron.IpcMainInvokeEvent
    ): Promise<PageIDType> {
      try {
        const result = settings.get('selectedPageID')
        return result ? 
          JSON.parse(result as string) as PageIDType :
          undefined
      } catch (error) {
        ThrowError({ 
          content: 'Error syncing settings',
          error: error,
        })
      }
    }
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'settings.selectedPageID:set',
    async function (
      event: Electron.IpcMainInvokeEvent,
      payload: { selectedPageID: PageIDType }
    ): Promise<any> {
      try {
        if (payload.selectedPageID === undefined) {
          return settings.set('selectedPageID', '')
        } else {
          return settings.set('selectedPageID', JSON.stringify(payload.selectedPageID))
        }
      } catch (error) {
        ThrowError({ 
          content: 'Error syncing settings',
          error: error,
        })
      }
    }
  )
})