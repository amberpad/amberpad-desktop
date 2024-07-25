import React, { useEffect, useRef, useState } from 'react'
import { Flex, Section, Box, Separator } from '@radix-ui/themes'
import { css } from '@emotion/css'

import store from '@renderer/utils/redux-store'
import commonsSlice from '@renderer/actions/commons.slice'
import pagesSlice, { fetchSelectedPageThunk } from '@renderer/actions/pages.slice'
import { fetchNotesThunk } from '@renderer/actions/notes.slice'
import { fetchNotepadsThunk } from '@renderer/actions/notepads.slice'
import Sidebar from '@renderer/sections/Sidebar'
import AddNote from '@renderer/sections/AddNote'
import NotesBoard from '@renderer/sections/NotesBoard'
import Header from '@renderer/sections/Header'

export default function Home() {
  const [context, setContext] = useState({
    commons: {
      search: '',
    },
    pages: {
      selectedPageID: undefined,
    }
  })

  useEffect(() => {
    store.monitor(
      (state) => ({
        search: state.commons.search,
        selectedPageID: state.pages.selectedPageID,
      }), 
      (state) => {
        setContext({
          commons:  {
            search: state.commons.search,
          },
          pages: {
            selectedPageID: state.pages.selectedPageID
          }
        })
      }
    )
  }, [])

  useEffect(() => {
    // Fetch selected page
    /*
    let promise: any = undefined
    if (context.pages.selectedPageID === undefined) {
      const { setSelectedPage } = pagesSlice.actions
      store.dispatch(setSelectedPage({ value: undefined }))
    } else {
      store.dispatch(fetchSelectedPageThunk({
        pageID: context.pages.selectedPageID
      }))
    }
    */
    store.dispatch(fetchSelectedPageThunk({
      pageID: context.pages.selectedPageID
    }))
    /*
    return () => {
      promise && promise.abort()
    }
    */
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

  /****************************************************************************
  * Local storage
  ****************************************************************************/

  /*
  useEffect(() => {
    if (context.pages.selectedPageID !== undefined) {
      window.electronAPI.store.set({ 
        key: 'selectedPageID',
        value: context.pages.selectedPageID,
      })
    }
  }, [context.pages.selectedPageID])
  */

  useEffect(() => {
    window.electronAPI.store
      .get({ key: 'selectedPageID' })
      .then((selectedPageID) => {
        const { setSelectedPageID } = pagesSlice.actions
        store.dispatch(setSelectedPageID({ value: selectedPageID }))
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
        color='yellow'
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
      >
        <Sidebar 

        />
        <Flex
          data-testid='home-content'
          minWidth='0'
          minHeight='0'
          width='100%'
          display='flex'
          direction='column'
          gap='0'
          justify='end'
          align='stretch'
          flexGrow='1'
        >
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