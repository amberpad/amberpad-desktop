import { app, ipcMain } from 'electron'
import { unflatten } from "flat"
import lodash from 'lodash'
import knex from 'knex'

import { ThrowError } from '@main/utils/errors'
import database from '@main/utils/database'
import * as pagesQueries from '@main/queries/pages'

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

export default function setup () {
  ipcMain.handle(
    'pages.get-all',
    async function (_, payload) {
      return await pagesQueries.getAll(payload)
    } as ModelQueryHandlerType<PagesFiltersPayloadType, PageType>
  )

  ipcMain.handle(
    'pages.get',
    async function get (_, payload) {
      for await (const queries of database.withConnection()) {
        const notepadsColumns = Object.keys(await queries('notepads').columnInfo())
        const pagesColumns = Object.keys(await queries('pages').columnInfo())
        const data = await queries('pages')
          .select([
            ...(pagesColumns.map((item) => ({[item]: `pages.${item}`}))),
            ...(notepadsColumns.map((item) => ({[`notepad.${item}`]: `notepads.${item}`})))
          ])
          .from('pages')
          .leftJoin('notepads', 'pages.notepadID', 'notepads.id')
          .where({ 'pages.id': payload.id })
  
        if (data.length === 0) {
          return { value: undefined }
        }
        return { value: unflatten(data[0]) }
      }
    }  as QueryHandlerType<{ id: PageIDType}, { value: PageType & { notepad: NotepadType } }>
  )

  ipcMain.handle(
    'pages.create',
    async function create (_, payload) {
      return {
        values: await database.helpers.create('pages', payload.data)
      }
    } as ModelCreateHandlerType<PagePayloadType, PageType>
  )

  ipcMain.handle(
    'pages.update',
    async function update (_, payload) {
      try {
        const knex = await database.getConnection();
        const instance = payload.value
        /* @ts-ignore */
        instance.updatedAt = knex.fn.now()

        const columns = Object.keys(await knex('pages').columnInfo())
        const data = await knex('pages')
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
    } as ModelUpdateHandlerType<PageType>
  )

  ipcMain.handle(
    'pages.destroy',
    async function destroy (_, payload) {
      try {
        const knex = await database.getConnection();
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
          msg: 'Row could not been removed',
          error: error,
        })
      }
    } as ModelDestroyHandlerType<PageType>
  )

  ipcMain.handle(
    'pages.moveTop',
    async function update (_, payload): Promise<boolean> {
      for await (const queries of database.withConnection()) {

        const updatedPages = await queries('pages')
        .where({ id: payload.value })
        .update({ updated_at: queries.fn.now() }, '*')

      const updatedNotepads = await queries('notepads')
        .where({ id: updatedPages[0].notepadID })
        .update({ updated_at: queries.fn.now() }, '*')

      return true        
      }
    }
  )

}