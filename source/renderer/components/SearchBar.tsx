import React, { useEffect, useState } from "react"
import { TextField, IconButton } from "@radix-ui/themes"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';

import store from "@renderer/utils/redux-store"
import commonsSlice from "@renderer/actions/commons.slice"

const SearchBar = () => {
  const [state, setState] = useState({
    search: '',
  })
  const [context, setContext] = useState({
    commons: {
      search: '',
    },
    notes: {
      page: 1,
    },
  })

  useEffect(() => {
    store.monitor(
      (state) => ({
        commons:  {
          search: state.commons.search,
        },
        notes: {
          page: state.notes.page
        },
      }), 
      (state) => {
        setContext({
          commons:  {
            search: state.commons.search,
          },
          notes: {
            page: state.notes.page,
          },
        })
      }
    )
  }, [])

  const sendSearch = (search: string) => {
    const { setSearch } = commonsSlice.actions
    store.dispatch(setSearch({ value: search }))
  }

  const clearSearch = () => {
    const { setSearch } = commonsSlice.actions
    store.dispatch(setSearch({ value: '' }))
    setState({search: ''})
  }

  const onInputChange = (event: any) => {
    setState({search: event.target.value})
  }

  const sendSearchFlag = state.search === '' || 
    state.search  !== context.commons.search;
  return (
    <TextField.Root
      data-testid='searchbar'
      variant='soft'
      placeholder='Search'
      value={state.search}
      onChange={(event) => onInputChange(event)}
      onKeyDown={(event: any) => (event.code === "Enter") ? sendSearch(state.search) : null }
    >
      <TextField.Slot 
        side='right'
      >
        {
          sendSearchFlag ?
            <IconButton
              data-testid='searchbar-send-button'
              variant="ghost"
              onClick={() => sendSearch(state.search)}
            >
              <FontAwesomeIcon 
                size='1x'
                icon={faMagnifyingGlass}
              />
            </IconButton>
          :          
            <IconButton 
              data-testid='searchbar-clear-button'
              variant="ghost"
              style={{cursor: 'pointer'}}
              onClick={() => clearSearch()}
            >
              <FontAwesomeIcon 
                size='1x'
                icon={faXmark}
              />
            </IconButton>
        }

      </TextField.Slot>
    </TextField.Root>
  )
}

export default SearchBar;