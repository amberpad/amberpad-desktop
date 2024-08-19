import { app, ipcMain } from 'electron'
import lodash from 'lodash'

import { ThrowError } from '@main/utils/errors'
import database from '@main/utils/database'

import type { 
  ModelQueryHandlerType,
  ModelCreateHandlerType,
  ModelUpdateHandlerType,
  ModelDestroyHandlerType,
} from '@ts/handlers.types'
import type {
  NotePayloadType,
  NotesFiltersPayloadType, 
  NoteType 
} from '@ts/models/Notes.types'

export async function getAll (
  options: NotesFiltersPayloadType = {
    search: null,
    pageID: undefined,
    page: 1,
  }
) {
  options.page = options.page < 1 ? 1 : options.page
  for await (const queries of database.withConnection()) {
    const data = await queries.raw(
      `
        SELECT * 
        FROM 
          (SELECT noteID, 
                  rank 
          FROM searches 
          WHERE noteContent MATCH ?) AS "SearchQuery" 
        FULL JOIN 
          (SELECT * 
          FROM notes) AS "NotesQuery" ON "SearchQuery"."noteID" = "NotesQuery"."id" 
        WHERE IIF(?=\'""\', 1, rank NOT NULL) 
          AND IIF(?=0, 1, pageID=?) 
        ORDER BY "SearchQuery"."rank" DESC, 
                "NotesQuery"."updated_at" DESC
        LIMIT ?
        OFFSET ?
      `.replace(/\s+/g,' '),
      [
        `"${options.search}"`,
        `"${options.search}"`,
        options.pageID || 0,
        options.pageID || 0,
        globals.PAGINATION_OFFSET,
        globals.PAGINATION_OFFSET * (options.page - 1)
      ]
    )

    return {
      values: data
    } 
  }
}