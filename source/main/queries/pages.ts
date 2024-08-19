import { app, ipcMain } from 'electron'
import { unflatten } from "flat"
import lodash from 'lodash'
import knex from 'knex'

import { ThrowError } from '@main/utils/errors'
import database from '@main/utils/database'

import type { 
  QueryHandlerType,
  ModelQueryHandlerType,
  ModelCreateHandlerType,
  ModelUpdateHandlerType,
  ModelDestroyHandlerType,
} from '@ts/handlers.types'
import type { 
  PagePayloadType, 
  PageType, 
  PageIDType,
  PagesFiltersPayloadType 
} from '@ts/models/Pages.types'
import { 
  NotepadType 
} from '@ts/models/Notepads.types'

export async function getAll (
  options: PagesFiltersPayloadType = {
    page: 1
  }
) {
  options.page = options.page < 1 ? 1 : options.page
  for await (const queries of database.withConnection()) {
    const data = await queries('pages')
      .select('*')
      .orderBy([{ column: 'updated_at', order: 'desc' }])
      .limit(globals.PAGINATION_OFFSET)
      .offset(globals.PAGINATION_OFFSET * (options.page - 1))

    return {
      values: data
    }
  }
}