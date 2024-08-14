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


export default function setup () {
  ipcMain.handle(
    'notes.get-all',
    async function (_, payload) {
      /* 
        -- Raw query
        -- pageID or 0
        -- search or ''

      SELECT *
      FROM `notes`
      WHERE IIF(?=0, 1, pageID=?)
        AND IIF(?='', 1, id in
                  (SELECT noteID
                  FROM searches
                  WHERE noteContent MATCH ?
                  ORDER BY rank DESC, noteID DESC))
      LIMIT ?

      SELECT *
      FROM
        (SELECT noteID,
                rank
        FROM searches
        WHERE noteContent MATCH '"1"') AS "SearchQuery"
      FULL JOIN
        (SELECT *
        FROM notes) AS "NotesQuery" ON "SearchQuery"."noteID" = "NotesQuery"."id"
      WHERE IIF('"1"'='""', 1, rank NOT NULL)
        AND IIF(1=0, 1, pageID=1)
      ORDER BY "SearchQuery"."rank" DESC,
              "NotesQuery"."id" DESC
      */
      const options = Object.assign({
        search: null,
        pageID: null,
        page: 1,
        paginationOffset: globals.PAGINATION_OFFSET
      }, payload)
      options.page = options.page < 1 ? 1 : options.page

      try {
        const knex = await database.getManager();
        const data = await knex.raw(
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
            options.paginationOffset,
            options.paginationOffset * (options.page - 1)
          ]
        )
        return {
          values: data
        } 
      } catch (error) {
        ThrowError({ 
          content: 'Error retrieving data from database',
          error: error,
        })
      } 
    }  as ModelQueryHandlerType<NotesFiltersPayloadType, NoteType>
  )

  ipcMain.handle(
    'notes.create',
    async function create (_, payload) {
      try {
        const knex = await database.getManager();
        const data = await knex('notes')
          .returning('*')
          .insert(payload.data)
        return {
          values: data as any[]
        }
      } catch (error) {
        ThrowError({ 
          content: 'Row could not been created',
          error: error,
        })
      }
    } as ModelCreateHandlerType<NotePayloadType, NoteType>
  )

  ipcMain.handle(
    'note.update',
    async function update (_, payload) {
      try {
        const knex = await database.getManager();
        const instance = payload.value
        instance.updatedAt = knex.fn.now()

        const columns = Object.keys(await knex('notes').columnInfo())
        const data = await knex('notes')
          .where({ id: instance.id })
          .update(lodash.pick(instance, columns), '*')

        if (data.length === 0) {
          throw('Row could not been updated')
        }
        return {value: data as any}
      } catch (error) {
        ThrowError({ 
          content: 'Row could not been updated',
          error: error,
        })
      }
    } as ModelUpdateHandlerType<NoteType>
  )

  ipcMain.handle(
    'notes.destroy',
    async function destroy (_, payload) {
      try {
        const knex = await database.getManager();
        const data = await knex('notes')
          .where({ id: payload.value.id })
          .delete('*')

          if (data.length === 0) {
            throw('Row could not been removed')
          }
        return {
          value: {
            id: undefined,
            ...payload.value
          }
        }
      } catch (error) {
        ThrowError({ 
          content: 'Row could not been removed',
          error: error,
        })
      }
    } as ModelDestroyHandlerType<NoteType>
  )
}