import _ from 'lodash'
import { useState } from "react"

type state = {[key: string]: any}

export default function useAsyncReducer(
  actions: {[key: string]: (clone: state, payload: any) => state},
    initState: {[key: string]: any}
  ) {
  const [state, setState] = useState(initState)
  let actionFunction = null
  const dispatch = async (action: {type: string, payload?: any}) => {
    try {
      actionFunction = await actions[action.type]
    } catch (error) {
      console.error(`Can't find action: ${action.type}`)
      return
    }

    try {
      const clone = _.cloneDeep(state)
      setState(await actionFunction(clone, action.payload))
    } catch (error) {
      console.error(error)
    }



  }
  return [state, dispatch]
}