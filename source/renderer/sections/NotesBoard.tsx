import React, { useEffect, useState } from 'react'
import { Box, Flex } from '@radix-ui/themes'

import store, { useStore } from '@renderer/utils/redux-store'
import { fetchNotesThunk } from '@renderer/actions/notes.slice'
import InifiniteScroll from '@renderer/wrappers/InifiniteScroll'
import Note from '@renderer/sections/Note'

import type { BoxProps } from '@radix-ui/themes'

function NotesBoard (props: BoxProps) {
  const context = useStore((state) => ({
    commons: { 
      search: state.commons.search,
    },
    notes: {
      values: state.notes.values,
      page: state.notes.page,
      hasNextPage: state.notes.hasNextPage,
      adjustScrollHash: state.notes.adjustScrollHash,
      scrollBeginingHash: state.notes.scrollBeginingHash,
      loading: state.notes.loading
    },
    pages: {
      selectedPageID: state.pages.selectedPageID
    }
  }))

  /*
  const [context, setContext] = useState({ 
    commons: {
      search: '',
    },
    notes: {
      values: [],
      page: 1,
      hasNextPage: true,
      adjustScrollHash: 0,
      scrollBeginingHash: 0,
      loading: false,
    },
    pages: {
      selectedPageID: undefined,
    }
  })

  useEffect(() => {
    store.monitor(
      (state) => ({
        commons: { 
          search: state.commons.search,
        },
        notes: {
          values: state.notes.values,
          page: state.notes.page,
          hasNextPage: state.notes.hasNextPage,
          adjustScrollHash: state.notes.adjustScrollHash,
          scrollBeginingHash: state.notes.scrollBeginingHash,
          loading: state.notes.loading
        },
        pages: {
          selectedPageID: state.pages.selectedPageID,
        }
      }),
      (state) => {
        setContext({
          commons: { 
            search: state.commons.search,
          },
          notes: {
            values: state.notes.values,
            page: state.notes.page,
            hasNextPage: state.notes.hasNextPage,
            adjustScrollHash: state.notes.adjustScrollHash,
            scrollBeginingHash: state.notes.scrollBeginingHash,
            loading: state.notes.loading
          },
          pages: {
            selectedPageID: state.pages.selectedPageID
          }
        })
      } 
    )
  }, [])
  */

  const onScrollNext = () => {
    store.dispatch(fetchNotesThunk({
      page: context.notes.page + 1,
      search: context.commons.search,
      pageID: context.pages.selectedPageID,
    }))   
  }

  return (
    <Box
      data-testid='notes-board'
      {...props}
    >
      <Flex
        width='100%'
        height='100%'
        pr='2'
        direction='column'
        gap='4'
        justify='start'
        align='end'
        overflowY='auto'
        overflowX='hidden'
        asChild={true}
      >
        <InifiniteScroll
          data={context.notes.values}
          renderItem={(item) => (
            <Note data={item} />
          )}
          getItemID={(item) => item.id}
          hasMore={context.notes.hasNextPage}
          inverse={true}
          loading={context.notes.loading}
          next={onScrollNext}
          scrollBeginingHash={`${context.notes.scrollBeginingHash}`}
          adjustScrollHash={`${context.notes.adjustScrollHash}`}
        />
      </Flex>
    </Box>
  )
}

export default NotesBoard