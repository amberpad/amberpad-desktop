import React, { ReactNode, useCallback, createContext, useContext, useEffect, useState } from 'react'

import type { UpdateInfo, ProgressInfo } from 'electron-updater'
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
  info: UpdateInfo,
  progress: ProgressInfo,
  updateDownloaded: boolean,

  cancelUpdate: () => void,
  downloadUpdate: () => void,
  quitAndInstall: () => void,
  cancelDownloadUpdate: () => void,
}

const appUpdaterContext = createContext<AppUpdaterContext>({
  status: 'idle',
  info: undefined,
  progress: undefined,
  updateDownloaded: false,
  cancelUpdate: () => undefined,
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
    progress: AppUpdaterContext['progress'],
    updateDownloaded: AppUpdaterContext['updateDownloaded'],
  }>({
    status: 'idle',
    info: undefined,
    progress: undefined,
    updateDownloaded: false,
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
        progress: payload,
      }))
    })
    
    updater.onUpdateDownloaded((payload) => {
      setState((prev) => ({ 
        ...prev,
        status: 'update-downloaded',
        updateDownloaded: true,
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

  const cancelUpdate = useCallback(() => {
    const { updater } = window.electronAPI
    updater.cancelDownloadUpdate()
    setState(prev => ({
      ...prev,
      status: 'cancelled'
    }))
  }, [])

  console.log('Updater', state)
  return (
    <appUpdaterContext.Provider
      value={{
        ...state,
        cancelUpdate,
        downloadUpdate,
        quitAndInstall,
        cancelDownloadUpdate,
      }}
    >
      {children}
    </appUpdaterContext.Provider>
  )
}
