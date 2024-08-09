import type { ElectronAPI } from "./preload"
import type { Initials as InitialsType } from "@main/handlers/initials.handler"

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
  type Initials = InitialsType
}

export {}
