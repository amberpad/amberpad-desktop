
import { NotepadIDType } from '@ts/models/Notepads.types'
import { BaseModelType } from '@ts/models/BaseModel.types'

export type PageIDType = number

export interface PagePayloadType {
  name: string,
  notepadID: NotepadIDType,
}

export interface PageDataType {
  name: string,
  notepadID: NotepadIDType,
}

export type PageType = BaseModelType & PageDataType

export interface PagesFiltersPayloadType {
  page?: number,
}