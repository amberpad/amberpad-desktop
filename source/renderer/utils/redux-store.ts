import equal from 'fast-deep-equal'
import { configureStore } from '@reduxjs/toolkit'

import commonsSlice from '@renderer/actions/commons.slice'
import notesSlice from '@renderer/actions/notes.slice'
import notepadsSlice from '@renderer/actions/notepads.slice'
import pagesSlice from '@renderer/actions/pages.slice'
import { useEffect, useState } from 'react'

const baseStore = configureStore({
  reducer: {
    notes: notesSlice.reducer,
    commons: commonsSlice.reducer,
    notepads: notepadsSlice.reducer,
    pages: pagesSlice.reducer,
  },
})
const store = baseStore as typeof store & { 
  monitor: typeof monitor
}

function monitor (
  extract: (context: ReturnType<typeof store.getState>) => any,
  callBack: (context: ReturnType<typeof store.getState>) => void,
) {
  const last: {current: any} = {current: undefined}
  store.subscribe(() => {
    const state = store.getState()
    const values = extract(state)
    if (!equal(last.current, values)) {
      last.current = values
      callBack(state)
    }
  })
}

store.monitor = monitor

export const useStore = (
  extract: (context: ReturnType<typeof store.getState>) => any
) => {
  const [context, useContext] = useState(() => {
    const initialState = store.getState()
    return extract(initialState)
  })

  useEffect(() => {
    store.monitor(extract, (state) => useContext(extract(state)))
  }, [])

  return context
}

export default store