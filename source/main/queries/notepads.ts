import database from '@main/utils/database'
import { unflatten } from 'flat'

import groupByAssociation from '@main/utils/database/groupByAssociation'

import { NotepadsFiltersPayloadType, NotepadsPagesFiltersPayloadType } from '@ts/models/Notepads.types'

export async function getAll (
  options: NotepadsFiltersPayloadType = {
    search: '',
    page: 1,
    associatedPaginationPage: 1,
  }
) {
  options.page = options.page < 1 ? 1 : options.page
  for await (const queries of database.withConnection()) {
    const notepadsColumns = Object.keys(await queries('notepads').columnInfo())
    const pagesColumns = Object.keys(await queries('pages').columnInfo())
    const data = await queries('notepads')
      .select([
        ...notepadsColumns,
        ...(pagesColumns.map((item) => ({[`pages.${item}`]: `pages:${item}`})))
      ])
      .from(queries.raw(
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
            globals.PAGINATION_OFFSET,
            globals.PAGINATION_OFFSET * (options.page - 1),
            `"${options.search}"`,
          ]
      ))
      .where(queries.raw(
        `rowNumber > ? AND rowNumber <= ?`,
        [
          globals.ASSOCIATED_PAGES_PAGINATION_OFFSET * (options.associatedPaginationPage - 1),
          globals.ASSOCIATED_PAGES_PAGINATION_OFFSET * options.associatedPaginationPage,
        ]
      ))
      .orderBy([{column: 'updated_at', order: 'desc'}])
  
    const unflattened = (unflatten({ref: data}) as any).ref
    return {
      values: groupByAssociation(unflattened, ['pages']),
    }
  }
}

export async function getPages (
  options: NotepadsPagesFiltersPayloadType
) {
  for await (const queries of database.withConnection()) {
    const pagesColumns = Object.keys(await queries('pages').columnInfo())
    const pagesSelectedColumns = 
      pagesColumns.map(item => `"pages"."${item}" as "pages.${item}"`).join(',\n')

    var data = []
    if (options.notepads.length > 0) {
      data = await queries.raw(`
        ${
          options.notepads.map(() => (`
            SELECT
              "pages"."notepadID" as "id",
              ${pagesSelectedColumns}
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
        ...options.notepads.reduce((previous, current) => [
          ...previous,
          current.id,
          globals.ASSOCIATED_PAGES_PAGINATION_OFFSET,
          globals.ASSOCIATED_PAGES_PAGINATION_OFFSET * (current.page - 1)  
        ], [])
      ])
    }

    const unflattened = (unflatten({ref: data}) as any).ref
    return {
      values: groupByAssociation(unflattened, ['pages'])
    }
  }
}