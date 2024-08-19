import { app, ipcMain } from 'electron'
import lodash from 'lodash'

import { ThrowError } from '@main/utils/errors'
import database from '@main/utils/database'
import * as notesQueries from '@main/queries/notes'

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
      return await notesQueries.getAll(payload)
    }  as ModelQueryHandlerType<NotesFiltersPayloadType, NoteType>
  )

  ipcMain.handle(
    'notes.create',
    async function create (_, payload) {
      return { 
        values: await database.helpers.create('notes', payload.data) 
      }
    } as ModelCreateHandlerType<NotePayloadType, NoteType>
  )

  ipcMain.handle(
    'note.update',
    async function update (_, payload) {
      try {
        const knex = await database.getConnection();
        const instance = payload.value
        /* @ts-ignore */
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
          msg: 'Row could not been updated',
          error: error,
        })
      }
    } as ModelUpdateHandlerType<NoteType>
  )

  ipcMain.handle(
    'notes.destroy',
    async function destroy (_, payload) {
      try {
        const knex = await database.getConnection();
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
          msg: 'Row could not been removed',
          error: error,
        })
      }
    } as ModelDestroyHandlerType<NoteType>
  )
}