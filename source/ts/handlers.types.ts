
import type Electron from 'electron'
import { BaseIDType, BaseModelType } from "@ts/models/BaseModel.types"

export interface BasePayloadFilter {}

export type QueryHandlerType<
  PayloadFilter extends BasePayloadFilter, 
  Result
> = (
  event: Electron.IpcMainInvokeEvent,
  payload: PayloadFilter,
) => Promise<Result>

export type ModelQueryHandlerType<
  PayloadFilter extends BasePayloadFilter, 
  Model extends BaseModelType
> = (
  event: Electron.IpcMainInvokeEvent,
  payload: PayloadFilter,
) => Promise<{
  values: Model[]
  nextCursor?: number
  hasNextPage?: boolean
}>

export type ModelCreateHandlerType<
  ModelPayload, 
  Model extends BaseModelType
> = (
  event: Electron.IpcMainInvokeEvent,
  payload: {
    data: ModelPayload[]
  },
) => Promise<{
  values: Model[]
}>

export type ModelUpdateHandlerType<
  Model extends BaseModelType
> = (
  event: Electron.IpcMainInvokeEvent,
  payload: {
    value: Model
  },
) => Promise<{
  value: Model
}>

export type ModelDestroyHandlerType<
  Model extends BaseModelType | BaseIDType
> = (
  event: Electron.IpcMainInvokeEvent,
  payload: {
    value: Model
  },
) => Promise<{
  value: Model
}>