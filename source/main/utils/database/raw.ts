
const BINDING_KEYS_REGEX = /:[a-zA-Z_$][a-zA-Z_$0-9\-]*:/g

type Primitive = boolean | string | number | undefined | null
type Bindings = {[key: string]: Primitive}

interface RawQuery {
  sql: string
  bindings: Bindings
  buildBindingsArray: () => Primitive[]
  buildSQL: () => string
  buildForKnex: () => { sql: string, bindings: Primitive[] }
  buildCursorPaginationQuery: (nextCursor: Primitive) => RawQuery
}

export function RawQuery(
  sql: RawQuery['sql'], 
  bindings: RawQuery['bindings'] = {}
): RawQuery {
  const context: Partial<RawQuery> = {
    sql: sql.replace(/\s+/g,' '),
    bindings,
  }

  context.buildBindingsArray = () => {
    const keys = [...sql.match(BINDING_KEYS_REGEX)].map(item => item.slice(1, -1))
    return keys.map(item => bindings[item])
  }

  context.buildSQL = () => {
    return sql.replace(BINDING_KEYS_REGEX, '?')
  }

  context.buildForKnex = () => {
    return {
      sql: context.buildSQL(),
      bindings: context.buildBindingsArray(),
    }
  }

  context.buildCursorPaginationQuery = (
    nextCursor,
  ) => {
    return RawQuery(
      `
        ${ context.sql }
        LIMIT :paginationSize:
        OFFSET (
          SELECT COALESCE (
            (
              SELECT row_num FROM (
                SELECT *, ROW_NUMBER() OVER () row_num
                FROM ( 
                  ${ sql }
                )
              )
              WHERE id = COALESCE(:cursor:, 0)
            ), 
            0
          )
        )
      `, 
        {
          ...context.bindings,
          cursor: nextCursor,
          paginationSize: globals.PAGINATION_OFFSET
        }
    )
  }

  return context as RawQuery
}
