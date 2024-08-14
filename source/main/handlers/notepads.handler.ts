import { app, ipcMain } from 'electron'
import { unflatten } from "flat"
import lodash from 'lodash'

import groupByAssociation from '@main/utils/database/groupByAssociation'
import { ThrowError } from '@main/utils/errors'
import database from '@main/utils/database'

import type { 
  ModelQueryHandlerType,
  ModelCreateHandlerType,
  ModelUpdateHandlerType,
  ModelDestroyHandlerType,
} from '@ts/handlers.types'
import type { 
  NotepadPayloadType, 
  NotepadType, 
  NotepadsFiltersPayloadType,
  NotepadsPagesFiltersPayloadType
} from '@ts/models/Notepads.types'

export default function setup () {
  ipcMain.handle(
    'notepads.get-all',
    async function getAll(_, payload) {
      /* -- Raw query
    
      */
      const options = Object.assign({
        search: '',
        page: 1,
        paginationOffset: globals.PAGINATION_OFFSET,
        associatedPage: 1,
        associatedPaginationOffset: globals.ASSOCIATED_PAGES_PAGINATION_OFFSET,
      }, payload)
      options.page = options.page < 1 ? 1 : options.page
    
      const knex = await database.getManager();
      const notepadsColumns = Object.keys(await knex('notepads').columnInfo())
      const pagesColumns = Object.keys(await knex('pages').columnInfo())
      const data = await knex('notepads')
        .select([
          ...notepadsColumns,
          ...(pagesColumns.map((item) => ({[`pages.${item}`]: `pages:${item}`})))
        ])
        .from(knex.raw(
          `(SELECT 
              ROW_NUMBER () OVER (
                  PARTITION BY "notepads"."id"
                  ORDER BY 
                    "pages"."updated_at" DESC,
                    "pages"."name" ASC
              ) AS rowNumber,
              ${notepadsColumns.map(item => `"notepads"."${item}" as "${item}"`).join(',\n')},
              ${pagesColumns.map(item => `"pages"."${item}" as "pages:${item}"`).join(',\n')}
            FROM "notepads"
            LEFT OUTER JOIN "pages" ON "notepads"."id"="pages"."notepadID"
            WHERE
                IIF(
                    ?='""',
                    "notepads"."id" IN (
                        SELECT id
                        FROM "notepads"
                        ORDER BY updated_at DESC
                        LIMIT ?
                        OFFSET ?
                    ),
                    "pages"."id" IN (
                        SELECT pageId
                        FROM "notes"
                        WHERE id IN (
                            SELECT noteID
                            FROM searches
                            WHERE noteContent MATCH ?
                        )
                        ORDER BY updated_at DESC
                    )
                ))
            `,
            [
              `"${options.search}"`,
              options.paginationOffset,
              options.paginationOffset * (options.page - 1),
              `"${options.search}"`,
            ]
        ))
        .where(knex.raw(
          `rowNumber > ? AND rowNumber <= ?`,
          [
            options.associatedPaginationOffset * (options.associatedPage - 1),
            options.associatedPaginationOffset * (options.associatedPage)
          ]
        ))
        .orderBy([{column: 'updated_at', order: 'desc'}])
    
      const unflattened = (unflatten({ref: data}) as any).ref
      return {
        values: groupByAssociation(unflattened, ['pages']),
      }
    }  as ModelQueryHandlerType<NotepadsFiltersPayloadType, NotepadType>
  )

  ipcMain.handle(
    'notepads.pages.all',
    async function (_, payload) {
      const options = Object.assign({
        page: 1,
        search: '',
        paginationOffset: globals.ASSOCIATED_PAGES_PAGINATION_OFFSET,
      }, payload)
      options.page = options.page < 1 ? 1 : options.page

      const knex = await database.getManager();
      const pagesColumns = Object.keys(await knex('pages').columnInfo())
      var data = []
      if (options.notepads.length > 0) {
        data = await knex.raw(`
          ${
            options.notepads.map((notepad) => (`
              SELECT
                "pages"."notepadID" as "id",
                ${pagesColumns.map(item => `"pages"."${item}" as "pages.${item}"`).join(',\n')}
              FROM "pages"
              WHERE "notepadID" = ?
              ORDER BY 
                "pages"."updated_at" DESC,
                "pages"."name" ASC
              LIMIT ?
              OFFSET ?
            `)).join(' UNION ')
          }
        `, [
          ...options.notepads.reduce((previus, current) => [
            ...previus,
            current.id,
            options.paginationOffset,
            options.paginationOffset * (current.page - 1)  
          ], [])
        ])
      }

      const unflattened = (unflatten({ref: data}) as any).ref
      return {
        values: groupByAssociation(unflattened, ['pages'])
      }
    } as ModelQueryHandlerType<NotepadsPagesFiltersPayloadType, NotepadType>
  )

  ipcMain.handle(
    'notepads.create',
    async function create (_, payload) {
      try {
        const knex = await database.getManager();
        const data = await knex('notepads')
          .returning('*')
          .insert(payload.data) as NotepadType[]
        return {
          values: data.map((item) => ({...item, pages: []})) as any[]
        }
      } catch (error) {
        ThrowError({ 
          content: 'Row could not been created',
          error: error,
        })
      }
    } as ModelCreateHandlerType<NotepadPayloadType, NotepadType>
  )

  ipcMain.handle(
    'notepads.update',
    async function update (_, payload) {
      try {
        const knex = await database.getManager()
        const instance = payload.value
        instance.updatedAt = knex.fn.now()

        const columns = Object.keys(await knex('notepads').columnInfo())
        const data = await knex('notepads')
          .where({ id: instance.id })
          .update(lodash.pick(instance, columns), '*')
        if (data.length === 0) {
          throw('Row could not been updated')
        }
        return {value: data[0] as any}
      } catch (error) {
        ThrowError({ 
          content: 'Row could not been updated',
          error: error,
        })
      }
    } as ModelUpdateHandlerType<NotepadType>
  )

  ipcMain.handle(
    'notepads.destroy',
    async function destroy (_, payload) {
      try {
        const knex = await database.getManager();
        const data = await knex('notepads')
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
    } as ModelDestroyHandlerType<NotepadType>
  )
}