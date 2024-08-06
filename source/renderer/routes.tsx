import React from "react"
import {
  HashRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom"

import Home from '@renderer/pages/Home'
import Updating from '@renderer/pages/Updating'

export function Router () {
  return (
    <Routes

    >
      <Route 
        index
        path="/"
        element={<Home />}
      />
      <Route 
        path="/updating"
        element={<Updating />}
      />
      <Route
        path="*"
        element={<Navigate to="/" replace={true} />}
      />
    </Routes>
  )
}
