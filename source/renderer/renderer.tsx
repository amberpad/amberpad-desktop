/// <reference path="../declarations.d.ts" />

import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { Theme } from '@radix-ui/themes'

import store from '@renderer/utils/redux-store'
import { Router } from '@renderer/routes'
import AlertProvider from '@renderer/providers/AlertProvider'
import AppUpdaterProvider from '@renderer/providers/AppUpdaterProvider'
import '@radix-ui/themes/styles.css'
import '@renderer/renderer.css'

const root = ReactDOM.createRoot(document.getElementById('root'))

const ThemeWrapper = ({ children }) => {
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
}

root.render(
  <React.StrictMode>
    <ReduxProvider store={store} >
      <AlertProvider>
        <AppUpdaterProvider>
          <ThemeWrapper>
            <Router />
          </ThemeWrapper>
        </AppUpdaterProvider>
      </AlertProvider>
    </ReduxProvider>
  </React.StrictMode>
)
