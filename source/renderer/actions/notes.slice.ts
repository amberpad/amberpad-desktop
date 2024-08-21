import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { PageIDType } from '@ts/models/Pages.types'
import type { NoteType, NotePayloadType } from "@ts/models/Notes.types"
import { Pagination } from '@ts/models/BaseModel.types'

export interface NotesSliceState {
  values: NoteType[],
  adjustScrollHash: number,
  scrollBeginingHash: number,
  loading: boolean,
  pagination: Pagination
  /*
  pagination: {
    page: number,
    hasNextPage: boolean,
  }
  */
}

export const fetchNotesThunk = createAsyncThunk(
  'notes/fetchNotes',
  async (
    payload: { 
      search: string,
      pageID: PageIDType,
      resetFeed?: boolean,
    },
    thunkAPI
  ) => {
    const state = thunkAPI.getState()['notes']
    //const page = !!payload.resetPagination ? 1 : (state.pagination.page + 1)
    const nextCursor = payload.resetFeed ? null : state.pagination.nextCursor
    const response = await window.electronAPI.notes.getAll({
      search: payload.search,
      pageID: payload.pageID,
      //page,
      nextCursor
    })

    if (thunkAPI.signal.aborted)
      throw '27b4ebe0-9da8-447d-9c1c-9f1e8079784f'

    if (response === undefined)
      throw 'fc9a41ad-b038-42f9-b83a-7a78f3ef226e'

    return {
      ...response,
      resetFeed: payload.resetFeed,
    }
  },
)

export const createNoteThunk = createAsyncThunk(
  'notes/createNote',
  async (payload: NotePayloadType, thunkAPI) => {
    const response = await window.electronAPI.notes.create({
      data: [ payload ]
    })

    if (thunkAPI.signal.aborted)
      throw '2e9c0acb-722b-42b7-b9e2-144222e8811d'

    if (response === undefined)
      throw 'cf788430-1b98-4dd4-9dd0-6ed963216080'

    return response
  },
)

export const updateNoteThunk = createAsyncThunk(
  'notepads/updateNote',
  async (payload: { value: NoteType }, thunkAPI) => {
    const response = await window.electronAPI.notes.update(payload)

    if (thunkAPI.signal.aborted)
      throw '8429c2e4-cdba-48d6-bcf1-c8258cc6ad79'

    if (response === undefined)
      throw '14c01fd9-677a-4c24-be60-a046cfea6e1c'

    return response
  },
)

export const destroyNoteThunk = createAsyncThunk(
  'notes/destroyNote',
  async (payload: { value: NoteType }, thunkAPI) => {
    const response = await window.electronAPI.notes.destroy({
      value: payload.value
    })

    if (thunkAPI.signal.aborted)
      throw '213b4d4f-38f3-40e6-be9f-2b4f9220696b'

    if (response === undefined)
      throw 'd729bde1-aca9-4551-9c83-2d1377cd4d7a'

    return payload
  },
)

function set (
  state: NotesSliceState, 
  action: PayloadAction<{ values: NoteType[] }>
) {
  state.values = action.payload.values
}

function addTop (
  state: NotesSliceState, 
  action: PayloadAction<{ values: NoteType[] }>
) {
  state.values = 
    [...action.payload.values, ...state.values]
  state.adjustScrollHash += 1
}

function addBotom (
  state: NotesSliceState, 
  action: PayloadAction<{ values: NoteType[] }>
) {
  state.values = 
    [...state.values, ...action.payload.values]
    state.scrollBeginingHash += 1
}


function update (
  state: NotesSliceState, 
  action: PayloadAction<{ values: NoteType[] }>
) {
  state.values = state.values.map((item) => 
    action.payload.values.find((paylodItem) => paylodItem.id === item.id) || 
    item
  )
}

function destroy (
  state: NotesSliceState, 
  action: PayloadAction<{ values: NoteType[] }>
) {
  state.values = state.values.filter((item) =>
    !action.payload.values.some((payloadItem) => payloadItem.id === item.id)
  )
}

function setPagination (
  state: NotesSliceState, 
  action: PayloadAction<{ pagination: Pagination }>
) {
  state.pagination = action.payload.pagination
}

const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    values: [],
    adjustScrollHash: 0,
    scrollBeginingHash: 0,
    loading: true,
    pagination: {
      //page: 1,
      nextCursor: null,
      hasNextPage: true,
    }
  } as NotesSliceState,
  reducers: {
    set,
    addTop,
    addBotom,
    update,
    destroy,
    setPagination,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotesThunk.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(fetchNotesThunk.rejected, (state, action) => {
      state.loading = false
    })
    builder.addCase(fetchNotesThunk.fulfilled, (state, action) => {
      (action.payload.resetFeed ? set : addTop )(
        state, 
        {
          ...action, 
          payload: {
            ...action.payload,
            values: action.payload.values.reverse(),
          }
        }
      )
      setPagination(state, { ...action, payload: {pagination: action.payload.pagination }})
      if (!action.payload.resetFeed) {
        state.adjustScrollHash += 1
      }
      state.loading = false
      //state.pagination = action.payload.pagination
      //state.pagination.nextCursor = action.payload.pagination.nextCursor as number
      //state.pagination.hasNextPage = action.payload.pagination.hasNextPage
    })
    builder.addCase(createNoteThunk.fulfilled, (state, action) => {
      addBotom(state, {...action, payload: { values: action.payload.values }})
      state.scrollBeginingHash += 1
    })
    builder.addCase(updateNoteThunk.fulfilled, (state, action) => {

    })
    builder.addCase(destroyNoteThunk.fulfilled, (state, action) => {
      destroy(state, {...action, payload: { values: [action.payload.value] }})
    })
  }
})

export default notesSlice