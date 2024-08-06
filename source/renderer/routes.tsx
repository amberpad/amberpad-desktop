import React from "react"
import {
  HashRouter,
  Routes,
  Route
} from "react-router-dom"

import Home from '@renderer/pages/Home'
import Updating from '@renderer/pages/Updating'

export function Router () {
  return (
    <HashRouter future={{ v7_startTransition: true }}>
      <Routes>
        <Route 
          path="/"
          element={<Home />}
        />
        <Route 
          path="/updating/"
          element={<Updating />}
        />
      </Routes>
    </HashRouter>
  )
}
