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

app.on('ready', () => {
  ipcMain.handle(
    'database.notepads:getAll',
    async function getAll (_, payload) {
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
                ORDER BY "pages"."id") AS rowNumber,
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
            ))`,
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
    } as ModelQueryHandlerType<NotepadsFiltersPayloadType, NotepadType>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.notepads.pages:get',
    async function getAll (_, payload) {
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
        data = await knex
          .select([
            'id',
            ...(pagesColumns.map((item) => ({[`pages.${item}`]: `pages:${item}`})))
          ])
          .from(
            knex.union(function () {
              options.notepads.map((notepad) => {
                this
                  .select('*')
                  .from(function () {
                    this
                      .rowNumber('rowNumber', 'id')
                      .select([
                        ...(pagesColumns.map((item) => ({[`pages:${item}`]: `pages.${item}`}))),
                        {'id': `pages.notepadID`}
                      ])
                      .from('pages')
                      .where('notepadID', notepad.id)
                  })
                  .where(knex.raw(
                    `rowNumber > ? AND rowNumber <= ?`,
                    [
                      options.paginationOffset * (notepad.page - 1),
                      options.paginationOffset * (notepad.page)
                    ]
                  ))
              })
            })
          )
      }

      const unflattened = (unflatten({ref: data}) as any).ref
      return {
        values: groupByAssociation(unflattened, ['pages'])
      }
    } as ModelQueryHandlerType<NotepadsPagesFiltersPayloadType, NotepadType>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.notepads:create',
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
})

app.on('ready', () => {
  ipcMain.handle(
    'database.notepads:update',
    async function update (_, payload) {
      try {
        const knex = await database.getManager();
        const columns = Object.keys(await knex('notepads').columnInfo())
        const data = await knex('notepads')
          .where({ id: payload.value.id })
          .update(lodash.pick(payload.value, columns), '*')
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
})

app.on('ready', () => {
  ipcMain.handle(
    'database.notepads:destroy',
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
})
