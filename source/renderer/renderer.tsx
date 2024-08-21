/// <reference path="../declarations.d.ts" />

import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { Theme } from '@radix-ui/themes'
import { HashRouter } from "react-router-dom"
import { css, injectGlobal } from '@emotion/css'

import store, { useStore } from '@renderer/utils/redux-store'
import commonsSlice, { CommonsSliceState } from "@renderer/actions/commons.slice"
import { Router } from '@renderer/routes'
import AlertProvider from '@renderer/providers/AlertProvider'
import AppUpdaterProvider from '@renderer/providers/AppUpdaterProvider'
import '@radix-ui/themes/styles.css'
import '@renderer/renderer.css'
import pagesSlice from './actions/pages.slice'
import notesSlice from './actions/notes.slice'

injectGlobal`

`

const ThemeWrapper = ({ children }) => {
  const context = useStore((state) => ({ 
    theme: state.commons.theme,
  }))

  if (context.theme === 'dark') {
    return (
      <Theme
        appearance='dark'
        accentColor='amber'
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
        accentColor='yellow'
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

  const { setTheme } = commonsSlice.actions
  store.dispatch(setTheme({ value: initials.theme.theme }))

  const { setThemeSource } = commonsSlice.actions
  store.dispatch(setThemeSource({ value: initials.theme.themeSource }))

  const { set, setPagination } = notesSlice.actions
  store.dispatch(set({ values: initials.notes.values }))
  store.dispatch(setPagination({ pagination: initials.notes.pagination }))

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
