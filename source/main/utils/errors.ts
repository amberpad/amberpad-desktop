import { dialog, app } from "electron"

import store from '@main/utils/electron-store'

type ThrowErrorParams = {
  msg?: string,
  title?: string,
  error?: Error,
}

export function ThrowError ({
  msg='',
  title='Error',
  error=undefined,
}: ThrowErrorParams = {} ) {
  if (error && globals.ENVIRONMENT !== 'testing') {
    const detail = `Type: Error\n\n` +
      `Stack:\n${error.stack || ''}\n\n` +
      `Globals:\n${JSON.stringify(globals, undefined, 4)}\n\n` +
      `Electron store:\n${JSON.stringify(store.store, undefined, 4)}\n\n`
    dialog.showMessageBox(undefined, {
      message: msg,
      detail: globals.DEBUG ? detail : '',
      type: 'error',
      title: title,
      buttons: [
        'Close'
      ]
    })
  }
}

export function ThrowFatalError ({
  msg='',
  title='Fatal error',
  error=undefined,
}: ThrowErrorParams = {} ) {
  if (error !== undefined) {
    const detail = `Type: Fatal Error\n\n` +
    `Stack:\n${error.stack || ''}\n\n` +
    `Globals:\n${JSON.stringify(globals, undefined, 4)}\n\n` +
    `Electron store:\n${JSON.stringify(store.store, undefined, 4)}\n\n`

    console.error(`${msg}\n${detail}`)
    if (globals.ENVIRONMENT === 'production') {
      dialog.showMessageBox(undefined, {
        message: msg,
        detail: globals.DEBUG ? detail : '',
        type: 'error',
        title: title,
        buttons: [
          'Close'
        ]
      }).then(() => {
        app.quit()
      })
    }
  } else {
    console.error(`${msg}`)
  }
}