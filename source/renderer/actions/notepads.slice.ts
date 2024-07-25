import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { PageType, PagePayloadType } from '@ts/models/Pages.types'
import type { NotepadType, NotepadIDType, NotepadPayloadType } from '@ts/models/Notepads.types'
import pagesSlice, { fetchSelectedPageThunk } from './pages.slice'

export interface NotepadsSliceState {
  values: NotepadType[],
  page: number,
  hasNextPage: boolean,
  adjustScrollHash: number,
  scrollBeginingHash: number,
  scrollEndHash: number,
  loading: boolean,
  paginationMap: {[key: NotepadIDType] : {
    page: number,
    hasNext: boolean,
    isLoading: boolean,
    hash: number,
  }},
}

export const fetchNotepadsThunk = createAsyncThunk(
  'notepads/fetchNotepads',
  async (payload: { page: number, search: string}, thunkAPI) => {
    const response = await window.electronAPI.notepads.getAll({
      page: payload.page,
      search: payload.search,
      paginationOffset: globals.PAGINATION_OFFSET,
      associatedPaginationPage: 1,
      associatedPaginationOffset: globals.ASSOCIATED_PAGES_PAGINATION_OFFSET,
    })

    if (thunkAPI.signal.aborted)
      throw 'b2c2e61b-aceb-4750-ac89-6e91e26c7b44'

    if (response === undefined)
      throw 'a2ac27ee-822b-4332-979b-34533f6fc001'

    return {
      ...response,
      page: payload.page,
    }
  },
)

export const createNotepadThunk = createAsyncThunk(
  'notepads/createNotepad',
  async (payload: NotepadPayloadType, thunkAPI) => {
    const response = await window.electronAPI.notepads.create({
      data: [payload]
    })

    if (thunkAPI.signal.aborted)
      throw 'a82f160b-84a3-4194-a10c-19dd2f71818b'

    if (response === undefined)
      throw '7123211a-9d4e-4fab-8162-add400383760'

    return response
  },
)

export const updateNotepadThunk = createAsyncThunk(
  'notepads/updateNotepad',
  async (payload: { value: NotepadType }, thunkAPI) => {
    const response = await window.electronAPI.notepads.update(payload)

    if (thunkAPI.signal.aborted)
      throw 'edcb2bd6-6314-403d-aa98-5847a90c2fbd'

    if (response === undefined)
      throw '42b47d00-4e6c-440d-9827-3a83da2c42a0'

    return response
  },
)

export const destroyNotepadThunk = createAsyncThunk(
  'notepads/destroyNotepad',
  async (payload: { value: NotepadType }, thunkAPI) => {
    const response = await window.electronAPI.notepads.destroy({
      value: payload.value
    })

    if (thunkAPI.signal.aborted)
      throw 'c3b86706-cb9e-4c35-97f5-20dd02272f4f'

    if (response === undefined)
      throw 'c5a0dde9-2a0b-4833-9f43-80ba41fdb4ef'

    return payload
  },
)

export const createpageThunk = createAsyncThunk(
  'notepads/createPage',
  async (payload: PagePayloadType, thunkAPI) => {
    const response = await window.electronAPI.pages.create({
      data: [payload]
    })

    if (thunkAPI.signal.aborted)
      throw 'b8c3fbcc-4191-48c2-a851-ab771baebbf9'

    if (response === undefined)
      throw '5cd24616-dd8e-442d-8d68-9b4cba2cb7d8'

    return response
  },
)

export const updatePageThunk = createAsyncThunk(
  'notepads/updatePage',
  async (payload: { value: PageType }, thunkAPI) => {
    const response = await window.electronAPI.pages.update(payload)

    if (thunkAPI.signal.aborted)
      throw '30435104-425f-4a6f-957e-baebd8321566'

    if (response === undefined)
      throw '7d03ef8f-3598-4347-a6b9-1bb19bc0b08c'

    return response
  },
)

export const destroyPageThunk = createAsyncThunk(
  'notes/destroyPage',
  async (payload: { value: PageType }, thunkAPI) => {
    const response = await window.electronAPI.pages.destroy({
      value: payload.value
    })

    if (thunkAPI.signal.aborted)
      throw '0442526a-6711-48c7-b914-e339ac044665'

    if (response === undefined)
      throw '6bfc3aed-7eec-49b5-85eb-cde0524454b8'

    return payload
  },
)

/****************************************************************************** 
* Pages thunks 
******************************************************************************/

export const fetchPagesThunk = createAsyncThunk(
  'notepads/fetchPages',
  async (
    payload: { 
      notepads: NotepadIDType[], 
      search: string,
    }, 
    thunkAPI
  ) => {
    const state = (thunkAPI.getState() as any).notepads as NotepadsSliceState

    const notepads = payload.notepads
      .filter((notepadID) => 
        state.paginationMap[notepadID].hasNext
      ).map((notepadID) => ({
        id: notepadID,
        page: state.paginationMap[notepadID] ?
          state.paginationMap[notepadID].page :
          2
      }))
    if (!notepads) 
      return { notepads: { values: [] } }
    const response = await window.electronAPI.notepads.getPages({
      notepads: notepads,
      search: '',
    })

    if (thunkAPI.signal.aborted)
      throw 'b2c2e61b-aceb-4750-ac89-6e91e26c7b44'

    if (response === undefined)
      throw 'a2ac27ee-822b-4332-979b-34533f6fc001'

    return {
      notepads: response,
    }
  },
)

function set (
  state: NotepadsSliceState, 
  action: PayloadAction<{ values: NotepadType[] }>
) {
  state.values = action.payload.values
  state.paginationMap = {}
  // For pages pagination
  action.payload.values.forEach(notepad => {
    state.paginationMap[notepad.id] = {
      page: 1,
      hasNext: true,
      isLoading: false,
      hash: 0,
    }
  })
}

function addTop (
  state: NotepadsSliceState, 
  action: PayloadAction<{ values: NotepadType[] }>
) {
  state.values = 
    [...action.payload.values, ...state.values]
  state.adjustScrollHash += 1
  // For pages pagination
  action.payload.values.forEach(notepad => {
    state.paginationMap[notepad.id] = {
      page: 1,
      hasNext: notepad.pages.length === globals.ASSOCIATED_PAGES_PAGINATION_OFFSET,
      isLoading: false,
      hash: 0,
    }
  })
}

function addBotom (
  state: NotepadsSliceState, 
  action: PayloadAction<{ values: NotepadType[] }>
) {
  state.values = 
    [...state.values, ...action.payload.values]
  // For pages pagination
  action.payload.values.forEach(notepad => {
    state.paginationMap[notepad.id] = {
      page: 1,
      hasNext: true,
      isLoading: false,
      hash: 0,
    }
  })
}


function update (
  state: NotepadsSliceState, 
  action: PayloadAction<{ values: NotepadType[] }>
) {
  state.values = state.values.map((item) => {
    const newValues = action.payload.values.find((paylodItem) => paylodItem.id === item.id) || {}
    return Object.assign(item, newValues)
  })
}

function destroy (
  state: NotepadsSliceState, 
  action: PayloadAction<{ values: NotepadType[] }>
) {
  state.values = state.values.filter((item) =>
    !action.payload.values.some((payloadItem) => payloadItem.id === item.id)
  )
  // For pages pagination
  action.payload.values.forEach(notepad => {
    delete state.paginationMap[notepad.id]
  })
}

function addNotepadPages (
  state: NotepadsSliceState, 
  action: PayloadAction<{ values: NotepadType[] }>
) {
  state.values = state.values.map((item) => {
    const payloadItem = action.payload.values.find((payloadItem) => payloadItem.id === item.id)
    return {
      ...item,
      pages: payloadItem ? [...item.pages, ...payloadItem.pages] : item.pages
    }
  })
}

function addPages (
  state: NotepadsSliceState, 
  action: PayloadAction<{ values: PageType[] }>
) {
  state.values = state.values.map((item) => {
    const payloadItem = action.payload.values.find((payloadItem) => payloadItem.notepadID === item.id)
    return {
      ...item,
      pages: payloadItem ? [...item.pages, payloadItem] : item.pages
    }
  })
}

function updatePages (
  state: NotepadsSliceState, 
  action: PayloadAction<{ values: PageType[] }>
) {
  state.values = state.values.map((notepad) => {
    const page = action.payload.values.find((page) => page.notepadID === notepad.id)
    if (page) {
      notepad.pages = notepad.pages.map((item) => item.id === page.id ? page : item)
    }
    return notepad
  })
}

function destroyPages (
  state: NotepadsSliceState, 
  action: PayloadAction<{ values: PageType[] }>
) {
  state.values = state.values.map((notepad) => {
    const page = action.payload.values.find((page) => page.notepadID === notepad.id)
    if (page) {
      notepad.pages = notepad.pages.filter((item) => item.id !== page.id)
    }
    return notepad
  })
}

/*
*  Extra Reducers
*/

const moveTop = (state, action) => {
  /*
  * Developer to be used with:
  * builder.addCase(fetchSelectedPageThunk.fulfilled, moveTop)
  * Deprecated because didnt know when to launch it, but gonna
  * keep it here in case is needed in the future.
  */
  if (
    action.meta.arg.pageID !== undefined &&
    action.payload.value !== undefined
  ) {
    const page = action.payload.value
    console.log('page', page)

    // Move notepad to first position in array
    const notepadIndex = state.values.findIndex((item) => item.id === page.notepadID)        
    state.values.unshift(state.values.splice(notepadIndex, 1)[0])

    // Move page to first position in array
    const pages = state.values[notepadIndex].pages
    const pageIndex = pages.findIndex((item) => item.id === page.id)        
    pages.unshift(pages.splice(pageIndex, 1)[0])

    window.electronAPI.pages.moveTop({ value: page.id })
  }
}

const notepadsSlice = createSlice({
  name: 'notepads',
  initialState: {
    values: [],
    page: 1,
    hasNextPage: true,
    adjustScrollHash: 0,
    scrollEndHash: 0,
    loading: false,
    paginationMap: {},
  } as NotepadsSliceState,
  reducers: {
    set,
    addTop,
    addBotom,
    update,
    destroy,
    addPages,
    updatePages,
    destroyPages,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotepadsThunk.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(fetchNotepadsThunk.rejected, (state, action) => {
      state.loading = false
    })
    builder.addCase(fetchNotepadsThunk.fulfilled, (state, action) => {
      (action.payload.page === 1 ? set : addBotom )(
        state, 
        {
          ...action, 
          payload: {
            ...action.payload,
            values: action.payload.values
          }
        }
      )
      state.loading = false
      state.page = action.payload.page
      
      // Notepads pagination
      if (action.payload.values.length < globals.PAGINATION_OFFSET) {
        state.hasNextPage = false
      }
      if (action.payload.page === 1) {
        state.adjustScrollHash += 1
      }
      // Pages pagination
      action.payload.values.forEach((notepad) => {
        if (notepad.pages.length < globals.PAGINATION_OFFSET) {
          state.paginationMap[notepad.id].hasNext = false
        }
      })
    })
    builder.addCase(createNotepadThunk.fulfilled, (state, action) => {
      addTop(state, { ...action, payload: { values: action.payload.values }})
      action.payload.values.forEach((notepad) => {
        state.paginationMap[notepad.id].hasNext = false
      })
      state.scrollBeginingHash += 1
    })
    builder.addCase(updateNotepadThunk.fulfilled, (state, action) => {
      update(state, {...action, payload: { values: [action.payload.value] }})
    })
    builder.addCase(destroyNotepadThunk.fulfilled, (state, action) => {
      destroy(state, { ...action, payload:{ values: [action.payload.value] } })
    })
    // Extra reducers for pages
    builder.addCase(createpageThunk.fulfilled, (state, action) => {
      addPages(state, {...action, payload: { values: action.payload.values }})
    })
    builder.addCase(updatePageThunk.fulfilled, (state, action) => {
      updatePages(state, {...action, payload: { values: [action.payload.value] }})
    })
    builder.addCase(destroyPageThunk.fulfilled, (state, action) => {
      destroyPages(state, { ...action, payload:{ values: [action.payload.value] } })
    })
    builder.addCase(fetchPagesThunk.pending, (state, action) => {
      action.meta.arg.notepads
        .filter((notepadID) => 
          state.paginationMap[notepadID].hasNext
        ).forEach((notepadID) => {
          state.paginationMap[notepadID].page += 1
          state.paginationMap[notepadID].isLoading = true
        })
    })
    builder.addCase(fetchPagesThunk.rejected, (state, action) => {
      action.meta.arg.notepads
        .filter((notepadID) => 
          state.paginationMap[notepadID].hasNext
        ).forEach((notepadID) => {
          state.paginationMap[notepadID].page -= 1
          state.paginationMap[notepadID].isLoading = false
        })
    })
    builder.addCase(fetchPagesThunk.fulfilled, (state, action) => {
      // Add received pages to every fetched notepad
      action.payload.notepads.values.forEach((payloadNotepad: any) => {
        const notepad = state.values.find((notepad) => notepad.id === payloadNotepad.id)
        notepad.pages = [...notepad.pages, ...payloadNotepad.pages]
        state.paginationMap[payloadNotepad.id].hash += 1
      })

      action.meta.arg.notepads
        .forEach((notepadID) => {
          state.paginationMap[notepadID].isLoading = false
        })

    })
  }
})

export default notepadsSlice