/// <reference path="../declarations.d.ts" />

import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { Theme } from '@radix-ui/themes'

import store from '@renderer/utils/redux-store'
import { Router } from '@renderer/routes'
import '@radix-ui/themes/styles.css'
import './renderer.css'

const root = ReactDOM.createRoot(document.getElementById('root'))

/*
Object.defineProperty(window, 'Text', {
  value: window.Text,
  writable: false,
});
*/


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
      <ThemeWrapper>
        <Router />
      </ThemeWrapper>
    </ReduxProvider>
  </React.StrictMode>
)
