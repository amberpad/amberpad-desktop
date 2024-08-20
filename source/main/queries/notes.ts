import { app, ipcMain } from 'electron'
import lodash from 'lodash'

import { ThrowError } from '@main/utils/errors'
import database from '@main/utils/database'
import knex from 'knex'

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
import { RawQuery } from '@main/utils/database/raw'
import { Data } from '@main/utils/database/data'

export async function getAll (
  options: NotesFiltersPayloadType = {
    search: null,
    pageID: undefined,
    nextCursor: null,
  }
) {
  for await (const queries of database.withConnection()) {
    const baseQuery = RawQuery(
      `
        SELECT *
        FROM 
            (SELECT noteID, rank 
            FROM searches 
            WHERE noteContent MATCH :search:) AS "SearchQuery" 
        FULL JOIN 
            (SELECT * FROM notes) AS 
            "NotesQuery" ON "SearchQuery"."noteID" = "NotesQuery"."id" 
        WHERE IIF(:search:='""', 1, rank NOT NULL) 
            AND IIF(:pageId:=0, 1, pageID=:pageId:)
        ORDER BY "SearchQuery"."rank" DESC,
            "NotesQuery"."id" DESC
      `,
      {
        search: `"${options.search}"`,
        pageId: options.pageID || 0
      }
    )

    const paginatedQuery = baseQuery.buildCursorPaginationQuery(options.nextCursor)
    const raw = paginatedQuery.buildForKnex()
    const data = await queries.raw(raw.sql, raw.bindings)
    const pagination = Data(data).getCursorPaginationObject()

    return {
      values: data,
      pagination
    }
  }
}
