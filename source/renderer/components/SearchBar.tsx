import React, { useEffect, useState } from "react"
import { TextField, IconButton } from "@radix-ui/themes"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';

import store, { useStore } from "@renderer/utils/redux-store"
import commonsSlice from "@renderer/actions/commons.slice"
import { css } from "@emotion/css";

const SearchBar = () => {
  const context = useStore((state) => ({
    commons:  {
      search: state.commons.search,
      theme: state.commons.theme,
    },
  }))
  const [state, setState] = useState({
    search: '',
  })

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
      className={
        context.commons.search === '' ?
        css`` :
        css`
        box-shadow: rgba(255, 197, 61, 0.19) 0px 5px 10px, rgba(255, 197, 61, 0.23) 0px 3px 3px;
        outline: 2px solid var(--amber-8);
      `}
      data-testid='searchbar'
      variant={context.commons.theme === 'light' ? 'surface': 'soft'}
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