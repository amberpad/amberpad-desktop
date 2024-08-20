import { BaseModelType, BaseIDType, Pagination } from "@ts/models/BaseModel.types"

export interface BasePayloadFilter {}

export type QueryInvokerType<
  PayloadFilter extends BasePayloadFilter, 
  Result
> = (
  payload: PayloadFilter,
) => Promise<Result>

export type ModelQueryInvokerType<
  PayloadFilter extends BasePayloadFilter, 
  Model extends BaseModelType
> = (
  payload: PayloadFilter,
) => Promise<{
  values: Model[],
  pagination: Pagination
}>

export type ModelCreateInvokerType<
  ModelPayload, 
  Model extends BaseModelType
> = (
  payload: {
    data: ModelPayload[]
  },
) => Promise<{
  values: Model[]
}>

export type ModelUpdateInvokerType<
  Model extends BaseModelType
> = (
  payload: {
    value: Model
  },
) => Promise<{
  value: Model
}>

export type ModelDestroyInvokerType<
  Model extends BaseModelType | BaseIDType
> = (
  payload: {
    value: Model
  },
) => Promise<{
  value: Model
}>