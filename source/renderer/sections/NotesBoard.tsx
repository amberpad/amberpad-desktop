import React, { useEffect, useState } from 'react'
import { Box, Flex, Heading, Spinner, Text } from '@radix-ui/themes'

import store, { useStore } from '@renderer/utils/redux-store'
import { fetchNotesThunk } from '@renderer/actions/notes.slice'
import InifiniteScroll from '@renderer/wrappers/InifiniteScroll'
import Note from '@renderer/sections/Note'
import EmptyBoardSVG from '@resources/ilustrations/drawing-on-chart-with-pencil.svg'

import type { BoxProps, FlexProps } from '@radix-ui/themes'
import { css } from '@emotion/css'

function NotesBoard (
  {
    ...aditionalProps
  } : FlexProps & {

  }
) {
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

  const onScrollNext = () => {
    store.dispatch(fetchNotesThunk({
      page: context.notes.page + 1,
      search: context.commons.search,
      pageID: context.pages.selectedPageID,
    }))   
  }

  if (context.notes.loading) {
    return (
      <Flex
        {...aditionalProps}
        data-testid='notes-board'
        width='100%'
        height='100%'
        direction='column'
        justify='center'
        align='center'
        gap='2'
      >
        <Spinner size='3' />
      </Flex>
    )
  }


  if (context.notes.values.length === 0) {
    return (
      <Flex
        {...aditionalProps}
        data-testid='notes-board'
        width='100%'
        height='100%'
        direction='column'
        justify='center'
        align='center'
        gap='2'
      >
        <EmptyBoardSVG 
          className={css`
            object-fit: contain;
            max-width: 55%;
            max-height: 55%;
            width: auto;
            height: auto;

            @media (min-width: 600px) {
              max-width: 600px;
            }
          `}
        />
        <Flex
          direction='column'
          justify='center'
          align='center'
          gap='2'
        >
          <Heading>You have no notes yet</Heading>
          <Text>Take you first note, your notes will be placed here</Text>
        </Flex>
      </Flex>
    )
  }

  return (
    <Flex
      {...aditionalProps}
      data-testid='notes-board'
      width='100%'
      height='100%'
      p='5'
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
          <Note 
            data={item}
            minWidth='220px'
            minHeight='80px'
            maxWidth='720px'
          />
        )}
        getItemID={(item) => item.id}
        hasMore={context.notes.hasNextPage}
        inverse={true}
        loading={context.notes.loading}
        next={onScrollNext}
        scrollBeginingHash={`${context.notes.scrollBeginingHash}`}
        adjustScrollHash={`${context.notes.adjustScrollHash}`}
        scrollbarSize='2'
      />
    </Flex>
  )
}

export default NotesBoard