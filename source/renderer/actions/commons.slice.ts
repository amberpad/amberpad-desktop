import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { stat } from 'original-fs'

export interface CommonsSliceState {
  search: string,
  initialIsSidebarOpen: boolean,
  isSidebarOpen: boolean,
}

export const commonsSliceInitials: CommonsSliceState = {
  search: '',
  initialIsSidebarOpen: undefined,
  isSidebarOpen: undefined,
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

/******************************************************************************
* Reducers
******************************************************************************/

function setSearch (
  state: CommonsSliceState, 
  action: PayloadAction<{ value: string }>
) {
  state.search = action.payload.value
}

function setIsSidebarOpen (
  state: CommonsSliceState, 
  action: PayloadAction<{ value: boolean }>
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

const commonsSlice = createSlice({
  name: 'commons',
  initialState: commonsSliceInitials,
  reducers: {
    setSearch,
    setIsSidebarOpen,
    toggleIsSidebarOpen,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInitialIsSidebarOpen.fulfilled, (state, action) => {
      state.initialIsSidebarOpen = action.payload
    })
  }
})

export default commonsSlice