import React, { useEffect, useRef, useState } from 'react'
import { Flex, Section, Box, Separator, Callout } from '@radix-ui/themes'
import { css } from '@emotion/css'

import store, { useStore } from '@renderer/utils/redux-store'
import pagesSlice, { fetchSelectedPageThunk } from '@renderer/actions/pages.slice'
import { fetchNotesThunk } from '@renderer/actions/notes.slice'
import { fetchNotepadsThunk } from '@renderer/actions/notepads.slice'
import Sidebar from '@renderer/sections/Sidebar'
import AddNote from '@renderer/sections/AddNote'
import NotesBoard from '@renderer/sections/NotesBoard'
import Alert from '@renderer/components/Alert'
import Header from '@renderer/sections/Header'
import commonsSlice ,{ CommonsSliceState } from '@renderer/actions/commons.slice'

export default function Home() {
  const context = useStore((state) => ({
    commons:  {
      search: state.commons.search,
      theme: state.commons.theme,
    },
    pages: {
      selectedPageID: state.pages.selectedPageID
    }
  }))

  /****************************************************************************
  * Fetch initial data
  ****************************************************************************/

  useEffect(() => {
    store.dispatch(fetchSelectedPageThunk({
      pageID: context.pages.selectedPageID
    }))
  }, [context.pages.selectedPageID])

  useEffect(() => {
    // Fetch notes
    const { search } = context.commons
    const { selectedPageID } = context.pages
    const promise = store.dispatch(fetchNotesThunk({ 
      page: 1, 
      search: search,
      pageID: selectedPageID,
    }))
    return () => {
      promise.abort()
    }
  }, [context.commons.search, context.pages.selectedPageID])

  useEffect(() => {
    // Fetch notepads
    const promise = store.dispatch(fetchNotepadsThunk({ 
      page: 1,
      search: context.commons.search,
    }))
    return () => {
      promise.abort()
    }
  }, [context.commons.search])

  useEffect(() => {
    window.electronAPI.theme.onThemeUpdate((theme) => {
      const { setTheme } = commonsSlice.actions
      store.dispatch(setTheme({ value: theme }))
    })
  }, [])

  return (
    <Flex
      width='100%'
      height='100dvh'
      display='flex'
      direction='column'
      gap='0'
      justify='start'
      align='stretch'
    >
      <Header />
      <Separator 
        color={context.commons.theme === 'light' ? 'gray' : 'yellow'}
        orientation='horizontal'
        size='4'
      />
      <Flex
        minHeight='0'
        display='flex'
        direction='row'
        gap='0'
        justify='start'
        align='stretch'
        flexGrow='1'
        flexShrink='1'
        overflowX='hidden'
      >
        <Sidebar />
        <Flex
          className={css`
            position: relative;
            min-width: 300px;
          `}
          data-testid='home-content'
          minHeight='0'
          width='100%'
          display='flex'
          direction='column'
          gap='0'
          justify='end'
          align='stretch'
          flexGrow='1'
        >
          <Flex
            data-testid='content-header'
            className={css`
              position: absolute;
              top: 0;
              right: 0;
              z-index: 12;
            `}
            mt='2'
            mx='4'
            direction='row'
            justify='end'
          >
            <Alert />
          </Flex>

          <NotesBoard 
            width='100%'
            minHeight='0'
            maxHeight='calc(100% - 100px)'
            flexGrow='1'
            p='4'
          />
          <AddNote />
        </Flex>
      </Flex>
    </Flex>
  );
}