import { app, ipcMain } from 'electron'
import { QueryTypes } from 'sequelize'

import { ThrowError } from '@utils/errors'
import getSelectFields from '@utils/database/getSelectFields'
import { groupByWidthAssociations } from '@utils/database/groupBy'
import database from "@utils/database"

import type { 
  ModelQueryHandler,
  ModelCreateHandler,
  ModelUpdateHandler,
  ModelDestroyHandler,
} from '@src/ts/handlers.types'
import type { 
  NotepadPayload, 
  Notepad, 
  NotepadFiltersPayload 
} from '@ts/models/Notepads.types'

app.on('ready', () => {
  ipcMain.handle(
    'database.notepads:getAll',
    async function getAll (_, payload) {
      const options = Object.assign({
        search: '',
        page: 1,
        paginationOffset: 20,
        associatedPaginationPage: 1,
        associatedPaginationOffset: 50,
      }, payload)
      if (options.page < 1) options.page = 1
    
      try {
        const data = await database.sequelize.query(`
        SELECT * 
        FROM (
            SELECT
                ROW_NUMBER () OVER (
                    PARTITION BY "notepads"."id"
                    ORDER BY "pages"."createdAt"
                ) as notepadsRowNumber,
                ${
                  getSelectFields(database.models.Notepad)
                },
                ${
                  getSelectFields(
                    database.models.Page, 
                    {
                      as: ({ fieldName }) => `pages.${fieldName}`
                    }
                  )
                }
            FROM "notepads"
            LEFT OUTER JOIN "pages" 
            ON "notepads"."id"="pages"."notepadId"
            WHERE
                "notepads"."id" IN (
                    SELECT id FROM "notepads" LIMIT ? OFFSET ?
                )
                ${
                  options.search ?
                    `
                    AND
                    "pages"."id" IN (
                        SELECT pageId FROM "notes"
                        WHERE
                            id IN (
                                select noteID 
                                FROM searches 
                                WHERE noteContent 
                                MATCH "${options.search}"
                                ORDER BY 
                                    rank DESC, 
                                    noteID DESC
                            )  
                    )
                    ` :
                    ''

                }
        )
        WHERE
            notepadsRowNumber > ? AND
            notepadsRowNumber <= ?
        `, {
          type: QueryTypes.SELECT,
          replacements: [
            options.paginationOffset,
            options.paginationOffset * (options.page - 1),
            options.associatedPaginationOffset * (options.associatedPaginationPage - 1),
            options.associatedPaginationOffset * (options.associatedPaginationPage),
          ],
          raw: true,
          nest: true,
        })
        return {
          values: groupByWidthAssociations(data, 'id', ['pages'])
        }
      } catch (error) {
        ThrowError({ 
          content: 'Error retrieving data from database',
          error: error,
        })
      }
     return undefined
    } as ModelQueryHandler<NotepadFiltersPayload, Notepad>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.notepads:create',
    async function create (_, payload) {
      try {
        const response = await database.models.Notepad.bulkCreate(payload.data as any)
        return {
          values: response.map((item) => ({
            ...item.dataValues,
            pages: [],
          }))
        }
      } catch (error) {
        ThrowError({ 
          content: 'Error retrieving data from database',
          error: error,
        })
      }
    } as ModelCreateHandler<NotepadPayload, Notepad>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.notepads:update',
    async function update (_, payload) {
      try {
        const response = await database.models.Notepad.update(
          payload.value, 
          { where: { id: payload.value.id } }
        )

        if (response[0] === 1) {
          return { value: payload.value }
        }
      } catch (error) {
        ThrowError({ 
          content: 'Error retrieving data from database',
          error: error,
        })
      }
    } as ModelUpdateHandler<Notepad>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.notepads:destroy',
    async function destroy (_, payload) {
      try {
        const response = await database.models.Notepad.destroy({ 
          where: { id: payload.value.id } 
        })
        if (response === 1) {
          return { value: payload.value }
        }
      } catch (error) {
        ThrowError({ 
          content: 'Error retrieving data from database',
          error: error,
        })
      }
    } as ModelDestroyHandler<Notepad>
  )
})
