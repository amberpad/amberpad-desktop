
import type { Pagination } from "@ts/models/BaseModel.types"

type Primitive = boolean | string | number | undefined | null
type RawData = {[key: string]: any}[]

interface Data {
  groupByAssociation: (
    associations: string[],
    options: {
      primaryKey?: string,
    } 
  ) => Data,
  getCursorPaginationObject: () => Pagination
}

export function Data(
  data: RawData
): Data {
  const context: Partial<Data> = {}

  context.groupByAssociation = (
    associations, 
    options = { primaryKey: ''}
  ) => {
    const map = new Map<string, any>()

    for(let dataIndex = 0; dataIndex < data.length; dataIndex++) {
      const item = data[dataIndex]
  
      var destination = undefined
      if (!map.has(item[options.primaryKey])) {
        destination = Object.assign({}, item)
        for (let i = 0; i < associations.length; i++) {
          destination[associations[i]] = []
        }
  
        for (let i = 0; i < associations.length; i++) {
          if (Object.values(item[associations[i]]).some((item) => item !== null))
            destination[associations[i]].push(item[associations[i]])
        }
      } else {
        destination = map.get(item[options.primaryKey])
        for (let i = 0; i < associations.length; i++) {
          destination[associations[i]].push(item[associations[i]])
        }
      }
  
      map.set(item[options.primaryKey], destination)
    }

    return Data(Array.from(map.values() as any))
  }

  context.getCursorPaginationObject = () => {
    const lastItem = data[data.length -1]
    return {
      nextCursor:  lastItem !== undefined ? lastItem['id'] : null,
      hasNextPage: data.length === globals.PAGINATION_OFFSET,
    } 
  }

  return context as Data
}