/// <reference path="../declarations.d.ts" />

import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { Theme } from '@radix-ui/themes'
import { HashRouter } from "react-router-dom"
import { css, injectGlobal } from '@emotion/css'

import store from '@renderer/utils/redux-store'
import { CommonsSliceState } from "@renderer/actions/commons.slice"
import { Router } from '@renderer/routes'
import AlertProvider from '@renderer/providers/AlertProvider'
import AppUpdaterProvider from '@renderer/providers/AppUpdaterProvider'
import '@radix-ui/themes/styles.css'
import '@renderer/renderer.css'
import pagesSlice from './actions/pages.slice'

const ThemeWrapper = ({ children }) => {
  const [context, setContext] = useState<{ theme: CommonsSliceState['theme'] }>({
    theme: 'os'
  })

  useEffect(() => {
    store.monitor(
      (state) => ({ theme: state.commons.theme }), 
      (state) => setContext({ theme: state.commons.theme })
    )
  }, [])

  const theme = context.theme
  if (theme === 'dark') {
    return (
      <Theme
        appearance='dark'
        accentColor='yellow'
        grayColor='sand'
        radius='large'
        scaling="105%"
        panelBackground='translucent'
      >
        {children}
      </Theme>
    )
  } else {
    return (
      <Theme
        appearance='light'
        accentColor='amber'
        grayColor='gray'
        radius='large'
        scaling="105%"
        panelBackground='solid'
      >
        {children}
      </Theme>
    )
  }
}

window.electronAPI.getInitials().then((initials) => {
  const root = ReactDOM.createRoot(document.getElementById('root'))

  const { setSelectedPageID } = pagesSlice.actions
  store.dispatch(setSelectedPageID({ value: initials.store.selectedPageID }))
  root.render(
    <React.StrictMode>
      <ReduxProvider store={store} >
        <HashRouter future={{ v7_startTransition: true }}>
          <AlertProvider>
            <AppUpdaterProvider>
              <ThemeWrapper>
                <Router />
              </ThemeWrapper>
            </AppUpdaterProvider>
          </AlertProvider>
        </HashRouter>
      </ReduxProvider>
    </React.StrictMode>
  )
})
