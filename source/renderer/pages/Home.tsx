import React, { useEffect, useRef, useState } from 'react'
import { Flex, Section, Box, Separator } from '@radix-ui/themes';

import store from '@renderer/utils/redux-store'
import commonsSlice, { commonsSliceInitials } from '@renderer/actions/commons.slice'
import pagesSlice, { fetchSelectedPageThunk } from '@renderer/actions/pages.slice'
import { fetchNotesThunk } from '@renderer/actions/notes.slice'
import { fetchNotepadsThunk } from '@renderer/actions/notepads.slice'
import ResizableSide from '@renderer/wrappers/ResizableSide';
import Searchbar from '@renderer/components/Searchbar';
import Sidebar from '@renderer/sections/Sidebar';
import AddNote from '@renderer/sections/AddNote';
import NotesBoard from '@renderer/sections/NotesBoard';

export default function Home() {
  const [state, setState] = useState({
    sidebarInitialAperture: undefined,
    addNoteIsFocused: false,
  })
  const [context, setContext] = useState({
    commons: {
      search: '',
      sidebarToggleHash: undefined,
    },
    pages: {
      selectedPageID: undefined,
    }
  })

  useEffect(() => {
    store.monitor(
      (state: any) => ({
        search: state.commons.search,
        selectedPageID: state.pages.selectedPageID,
        sidebarToggleHash: state.commons.sidebarToggleHash,
      }), 
      (state: any) => {
        setContext({
          commons:  {
            search: state.commons.search,
            sidebarToggleHash: state.commons.sidebarToggleHash,
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
    let promise: any = undefined
    if (context.pages.selectedPageID === undefined) {
      const { setSelectedPage } = pagesSlice.actions
      store.dispatch(setSelectedPage({ value: undefined }))
    } else {
      store.dispatch(fetchSelectedPageThunk({
        pageID: context.pages.selectedPageID
      }))
    }
    return () => {
      promise && promise.abort()
    }
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
    (async () => {
      const { setSelectedPageID } = pagesSlice.actions
      const selectedPageID = await window.electronAPI.store.get({ key: 'selectedPageID' })
      store.dispatch(setSelectedPageID({ value: selectedPageID }))
    })()
  }, [])

  useEffect(() => {
    window.electronAPI.store
      .get({ key: 'sidebarAperture' })
      .then((aperture) => {
        setSidebarInitialAperture(aperture)
      })
  }, [])

  const onSidebarApertureChange = (aperture: string) => {
    window.electronAPI.store
      .set({ key: 'sidebarAperture', value: aperture })
  }

  const onSidebarOpen = () => {
    const { setIsSidebarOpen } = commonsSlice.actions
    store.dispatch(setIsSidebarOpen({ value: true }))
  }

  const onSidebarClose = () => {
    const { setIsSidebarOpen } = commonsSlice.actions
    store.dispatch(setIsSidebarOpen({ value: false }))
  }

  const setSidebarInitialAperture = (initialAperture: string) => {
    setState((prev) => ({ 
      ...prev, 
      sidebarInitialAperture: initialAperture 
    }))
  }

  const setAddNoteIsFocused = (addNoteIsFocused: boolean) => {
    setState((prev) => ({ 
      ...prev, 
      addNoteIsFocused: addNoteIsFocused 
    }))
  }

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
      <Section
        test-id='header'
        size='1'
      >
        <Flex
          display='flex'
          direction='row'
          gap='1'
          justify='center'
          align='center'
          px='6'
        >
          <Box
            flexGrow='1'
            maxWidth='768px'
          >
            <Searchbar />
          </Box>
        </Flex>
      </Section>
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
        <Box
          className='sidebar__container'
          minHeight='0px'
          asChild={true}
        >
          <ResizableSide
            direction='right'
            minSize='72px'
            maxSize='520px'
            offsetpad='120px'
            initialIsOpen={
              globals.ENVIRONMENT === 'testing' || 
              commonsSliceInitials.isSidebarOpen
            }
            initialAperture={state.sidebarInitialAperture}
            toggleIsOpenHash={context.commons.sidebarToggleHash}
            onOpen={onSidebarOpen}
            onClose={onSidebarClose}
            onApertureChange={onSidebarApertureChange}
            separator={
              <div 
                className='resizable-side__vertical-divider'
              />
            }
          >
            <Box
              width='100%'
              height='100%'
              overflow='clip'
              asChild={true}
            >
              <Sidebar />
            </Box>
          </ResizableSide>
        </Box>

        <Flex
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
          <Box
            width='100%'
            minHeight='0'
            flexGrow='10'
            asChild={true}
          >
            <ResizableSide
              direction='top'
              minSize='100px'
              offsetpad='120px'
              isOpen={state.addNoteIsFocused}
              separator={
                <div className='resizable-side__horizontal-divider'/>
              }
            >
              <Box
                width='100%'
                height='100%'
                overflow='clip'
              >
                {
                  <AddNote
                    p='4'
                    onFocusChange={(isFocused) => setAddNoteIsFocused(isFocused)}
                  />
                }

              </Box>
            </ResizableSide>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}