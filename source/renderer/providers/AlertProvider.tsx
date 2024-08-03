import React, { createContext, ReactNode, useContext, useRef, useState } from 'react'
import lodash from 'lodash'

export type AlertType = 'info' | 'success' | 'error' | 'warning' | 'system'
export type AlertDuration = 'short' | 'regular' | 'long' | 'extra-long'

// Milliseconds
const durationMap: Map<AlertDuration, number> = new Map([
  ['short', 1 * 1000],
  ['regular', 2.5 * 1000],
  ['long', 5 * 1000],
  ['extra-long', 10 * 1000],
])

interface AlertState {
  content?: ReactNode
  type?: AlertType
  isActive?: boolean
}

interface AlertCommands {
  show: (
    content: ReactNode | string, 
    type?: AlertType,
    duration?: AlertDuration,
  ) => void
  dismiss: () => void
}

type AlertContext = AlertState & AlertCommands & {}

const alertContext = createContext<AlertContext>({
  show: () => undefined,
  dismiss: () => undefined,
})

export const useAlert = () => {
  return useContext(alertContext)
}

export default function AlertProvider (
  {
    children=undefined,
  }: {
    children?: ReactNode
  }
) {
  const [state, setState] = useState<AlertState>({
    type: 'info',
    content: undefined,
    isActive: undefined,
  })

  const timeout = useRef<NodeJS.Timeout>()
  const show = lodash.throttle((
    content: ReactNode, 
    type: AlertType='info', 
    duration: AlertDuration='regular'
  ) => {
    dismiss()
    setState({
      type,
      content,
      isActive: true,
    })

    timeout.current = setTimeout(() => {
      dismiss()
    }, durationMap.get(duration))
  }, 100)

  const dismiss = () => {
    clearTimeout(timeout.current)
    setState({
      type: 'info',
      content: undefined,
      isActive: false,
    })
  }

  return (
    <alertContext.Provider
      value={{
        ...state,
        show,
        dismiss,
      }}
    >
      {children}
    </alertContext.Provider>
  )
}