
type Primitive = boolean | string | number | undefined | null

export interface BaseModelType {
  id: number,
  createdAt: Date,
  updatedAt: Date,
} 

export interface Pagination {
  nextCursor: Primitive,
  hasNextPage: boolean,
}

export type BaseIDType = string | number