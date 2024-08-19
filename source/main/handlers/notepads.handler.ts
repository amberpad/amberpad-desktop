import { app, ipcMain } from 'electron'
import { unflatten } from "flat"
import lodash from 'lodash'

import groupByAssociation from '@main/utils/database/groupByAssociation'
import { ThrowError } from '@main/utils/errors'
import database from '@main/utils/database'
import * as notepadsQueries from '@main/queries/notepads'

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
    async function getAll(event, payload) {
      return await notepadsQueries.getAll(payload)
    }  as ModelQueryHandlerType<NotepadsFiltersPayloadType, NotepadType>
  )

  ipcMain.handle(
    'notepads.pages.all',
    async function (_, payload) {
      return await notepadsQueries.getPages(payload)
    } as ModelQueryHandlerType<NotepadsPagesFiltersPayloadType, NotepadType>
  )

  ipcMain.handle(
    'notepads.create',
    async function create (_, payload) {
      const values = await database.helpers.create('notepads', payload.data)
      return {
        values: values.map((item) => ({...item, pages: []})) as any[]
      }
    } as ModelCreateHandlerType<NotepadPayloadType, NotepadType>
  )

  ipcMain.handle(
    'notepads.update',
    async function update (_, payload) {
      try {
        const knex = await database.getConnection()
        const instance = payload.value
        /* @ts-ignore */
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
          msg: 'Row could not been updated',
          error: error,
        })
      }
    } as ModelUpdateHandlerType<NotepadType>
  )

  ipcMain.handle(
    'notepads.destroy',
    async function destroy (_, payload) {
      try {
        const knex = await database.getConnection();
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
          msg: 'Row could not been removed',
          error: error,
        })
      }
    } as ModelDestroyHandlerType<NotepadType>
  )
}