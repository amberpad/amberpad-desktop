import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CommonsSliceState {
  search: string,
  initialIsSidebarOpen: boolean,
  isSidebarOpen: boolean,
  theme: 'dark' | 'light' | 'os',
}

export const commonsSliceInitials: CommonsSliceState = {
  search: '',
  initialIsSidebarOpen: undefined,
  isSidebarOpen: undefined,
  theme: 'os',
}

/******************************************************************************
* Async thunks
******************************************************************************/

export const fetchInitialIsSidebarOpen = createAsyncThunk(
  'commons/fetchInitialIsSidebarOpen',
  async (payload: undefined, thunkAPI) => {
    return await window.electronAPI.store
      .get({ key: 'isSidebarOpen' })
  }
)

export const fetchInitialTheme = createAsyncThunk(
  'commons/fetchInitialTheme',
  async (payload: undefined, thunkAPI) => {
    return await window.electronAPI.store
      .get({ key: 'theme' })
  }
)

/******************************************************************************
* Reducers
******************************************************************************/

function setSearch (
  state: CommonsSliceState, 
  action: PayloadAction<{ value: CommonsSliceState['search'] }>
) {
  state.search = action.payload.value
}

function setIsSidebarOpen (
  state: CommonsSliceState, 
  action: PayloadAction<{ value: CommonsSliceState['isSidebarOpen'] }>
) {
  state.isSidebarOpen = action.payload.value
}

function toggleIsSidebarOpen (
  state: CommonsSliceState, 
) {
  state.isSidebarOpen = !(
    state.isSidebarOpen === undefined ?
      state.initialIsSidebarOpen :
      state.isSidebarOpen
  )
}

function setTheme (
  state: CommonsSliceState, 
  action: PayloadAction<{ value: CommonsSliceState['theme'] }>
) {
  state.theme = action.payload.value
  // Save in local storage
  window.electronAPI.store.set({ 
    key: 'theme',
    value: action.payload.value,
  })
}

const commonsSlice = createSlice({
  name: 'commons',
  initialState: commonsSliceInitials,
  reducers: {
    setSearch,
    setIsSidebarOpen,
    toggleIsSidebarOpen,
    setTheme,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInitialIsSidebarOpen.fulfilled, (state, action) => {
      state.initialIsSidebarOpen = action.payload
    })
    builder.addCase(fetchInitialTheme.fulfilled, (state, action) => {
      state.theme = action.payload
    })
  }
})

export default commonsSlice