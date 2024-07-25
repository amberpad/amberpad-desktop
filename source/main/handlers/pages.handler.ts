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

app.on('ready', () => {
  ipcMain.handle(
    'pages.getAll',
    async function getAll (_, payload) {
      const options = Object.assign({
        page: 1,
        paginationOffset: globals.ASSOCIATED_PAGES_PAGINATION_OFFSET,
      }, payload)
      options.page = options.page < 1 ? 1 : options.page

      const data = await knex('pages')
        .select('*')
        .orderBy([{ column: 'updated_at', order: 'desc' }])
        .limit(options.paginationOffset)
        .offset(options.paginationOffset * (options.page - 1))

      return {
        values: data
      }
    } as ModelQueryHandlerType<PagesFiltersPayloadType, PageType>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'pages.get',
    async function get (_, payload) {
      const knex = await database.getManager();
      const notepadsColumns = Object.keys(await knex('notepads').columnInfo())
      const pagesColumns = Object.keys(await knex('pages').columnInfo())
      const data = await knex('pages')
        .select([
          ...(pagesColumns.map((item) => ({[item]: `pages.${item}`}))),
          ...(notepadsColumns.map((item) => ({[`notepad.${item}`]: `notepads.${item}`})))
        ])
        .from('pages')
        .leftJoin('notepads', 'pages.notepadID', 'notepads.id')
        .where({ 'pages.id': payload.pageID })

      if (data.length === 0) {
        throw('Row could not been got from database')
      }
      return {value: unflatten(data[0])}
    }  as QueryHandlerType<{ pageID: PageIDType}, { value: PageType & { notepad: NotepadType } }>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'pages.create',
    async function create (_, payload) {
      try {
        const knex = await database.getManager();
        const data = await knex('pages')
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
    } as ModelCreateHandlerType<PagePayloadType, PageType>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'pages.update',
    async function update (_, payload) {
      try {
        const knex = await database.getManager();
        const instance = payload.value
        instance.updatedAt = knex.fn.now()

        const columns = Object.keys(await knex('notes').columnInfo())
        const data = await knex('pages')
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
    } as ModelUpdateHandlerType<PageType>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'pages.destroy',
    async function destroy (_, payload) {
      try {
        const knex = await database.getManager();
        const data = await knex('pages')
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
    } as ModelDestroyHandlerType<PageType>
  )
})



app.on('ready', () => {
  ipcMain.handle(
    'pages.moveTop',
    async function update (_, payload): Promise<boolean> {
      try {
        const knex = await database.getManager()

        const updatedPages = await knex('pages')
          .where({ id: payload.value })
          .update({ updated_at: knex.fn.now() }, '*')

        const updatesNotepads = await knex('notepads')
          .where({ id: updatedPages[0].notepadID })
          .update({ updated_at: knex.fn.now() }, '*')

        return true
      } catch (error) {
        ThrowError({ 
          content: 'Values could not been updated',
          error: error,
        })
        return false
      }
    }
  )
})