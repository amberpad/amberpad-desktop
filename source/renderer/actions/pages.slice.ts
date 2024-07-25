import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { NotepadType } from '@ts/models/Notepads.types'
import type { PageType, PageIDType } from '@ts/models/Pages.types'

export interface PagesSliceState {
  selectedPageID: PageIDType,
  selectedPage: PageType & { notepad: NotepadType},
  loadingSelectedPage: boolean,
}

export const fetchSelectedPageThunk = createAsyncThunk(
  'pages/fetchSelectedPage',
  async (payload: { pageID: PageIDType }, thunkAPI) => {
    if (payload.pageID === undefined) {
      return { value: undefined }
    }

    const response = await window.electronAPI.pages.get({
      pageID: payload.pageID
    })

    if (thunkAPI.signal.aborted)
      throw '3886e733-ca70-419d-a494-d3eb09311fa9'

    if (response === undefined)
      throw '97f0de81-b0be-4996-b31a-ac2cad153180'

    return {
      ...response,
    }
  },
)

function setSelectedPageID(
  state: PagesSliceState, 
  action: PayloadAction<{ value: PagesSliceState['selectedPageID'] }>
) {
  state.selectedPageID = action.payload.value
}

function setSelectedPage(
  state: PagesSliceState, 
  action: PayloadAction<{ value: PagesSliceState['selectedPage'] }>
) {
  state.selectedPage = action.payload.value
}

const pagesSlice = createSlice({
  name: 'pages',
  initialState: {
    selectedPageID: undefined,
    selectedPage: undefined,
  } as PagesSliceState,
  reducers: {
    setSelectedPageID,
    setSelectedPage,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSelectedPageThunk.pending, (state, action) => {
      state.loadingSelectedPage = true
    })
    builder.addCase(fetchSelectedPageThunk.rejected, (state, action) => {
      state.selectedPageID = undefined
      state.selectedPage = undefined
      state.loadingSelectedPage = false
    })
    builder.addCase(fetchSelectedPageThunk.fulfilled, (state, action) => {
      setSelectedPage(state, action)
      state.loadingSelectedPage = false
      window.electronAPI.store.set({ 
        key: 'selectedPageID',
        value: action.payload.value && action.payload.value.id,
      })
    })
  }
})

export default pagesSlice