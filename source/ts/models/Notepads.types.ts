import type { PageType, PageIDType } from '@ts/models/Pages.types'
import type { BaseModelType } from '@ts/models/BaseModel.types'

export type NotepadIDType = number

export interface NotepadPayloadType {
  name: string
}

export interface NotepadDataType {
  name: string
  pages: PageType[]
}

export type NotepadType = BaseModelType & NotepadDataType

export interface NotepadsFiltersPayloadType {
  page?: number,
  search?: string,
  associatedPaginationPage?: number,
}

export interface NotepadsPagesFiltersPayloadType {
  notepads: {
    id: NotepadIDType,
    page: number
  }[],
}