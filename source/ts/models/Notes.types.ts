import { BaseModelType } from '@ts/models/BaseModel.types'
import type { PageType, PageIDType } from '@ts/models/Pages.types'

export type NoteIDType = number

export interface NotePayloadType {
  content: string,
  pageID: PageIDType,
}

export interface NoteDataType {
  content: string,
  pageID: PageIDType,
  page?: PageType,
}

export type NoteType = BaseModelType & NoteDataType

export interface NotesFiltersPayloadType {
  search?: string,
  pageID?: PageIDType,
  page?: number,
}