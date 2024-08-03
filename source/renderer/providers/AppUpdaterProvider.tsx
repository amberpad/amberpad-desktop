import React, { ReactNode, useCallback, createContext, useContext, useEffect, useState } from 'react'

import type { UpdateInfo } from 'electron-updater'
import { useAlert } from './AlertProvider'

export interface AppUpdaterContext {
  status: 'idle' | 
    'checking-for-updates' |
    'update-available' |
    'update-not-available' |
    'dowloading-update' | 
    'update-downloaded' | 
    'cancelled' | 
    'error',
  percent: number,
  info: UpdateInfo,

  downloadUpdate: () => void,
  quitAndInstall: () => void,
  cancelDownloadUpdate: () => void,
}

const appUpdaterContext = createContext<AppUpdaterContext>({
  status: 'idle',
  percent: 0,
  info: undefined,
  downloadUpdate: () => undefined,
  quitAndInstall: () => undefined,
  cancelDownloadUpdate: () => undefined,
})

export const useAppUpdater = () => {
  return useContext(appUpdaterContext)
}

export default function AppUpdaterProvider (
  {
    children=undefined,
  }: {
    children?: ReactNode
  }
) {
  const [state, setState] = useState<{
    status: AppUpdaterContext['status']
    info: AppUpdaterContext['info'],
    percent: AppUpdaterContext['percent'],
  }>({
    status: 'idle',
    info: undefined,
    percent: 0,
  })
  const { show } = useAlert()

  useEffect(() => {
    const { updater } = window.electronAPI

    setState((prev) => ({ 
      ...prev,
      status: 'checking-for-updates'
    }))


    updater.onError((error) => {
      show('Problem encountered while checking for updates', 'error', 'long')

      setState((prev) => ({ 
        ...prev,
        status: 'error'
      }))
    })

    updater.checkForUpdates().then((result) => {
      if (result !== null) {
        setState(prev => ({
          ...prev,
          status: 'update-available',
          info: result
        }))
      } else {
        setState(prev => ({
          ...prev,
          status: 'update-not-available'
        }))
      }
    })
  }, [])

  const downloadUpdate = useCallback(() => {
    const { updater } = window.electronAPI
    updater.downloadUpdate()

    setState((prev) => ({ 
      ...prev,
      status: 'dowloading-update',
    }))

    updater.onDownloadProgress((payload) => {
      setState((prev) => ({ 
        ...prev,
        percent: payload.percent,
      }))
    })
    
    updater.onUpdateDownloaded((payload) => {
      setState((prev) => ({ 
        ...prev,
        status: 'update-downloaded',
        percent: 100,
      }))
    })
  }, [])

  const quitAndInstall = useCallback(() => {
    const { updater } = window.electronAPI
    updater.quitAndInstall()
    setState(prev => ({
      ...prev,
      status: 'idle'
    }))
  }, [])

  const cancelDownloadUpdate = useCallback(() => {
    const { updater } = window.electronAPI
    updater.cancelDownloadUpdate()
    setState(prev => ({
      ...prev,
      status: 'update-available'
    }))
  }, [])

  return (
    <appUpdaterContext.Provider
      value={{
        ...state,
        downloadUpdate,
        quitAndInstall,
        cancelDownloadUpdate,
      }}
    >
      {children}
    </appUpdaterContext.Provider>
  )
}
