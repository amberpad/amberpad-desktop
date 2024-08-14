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
      adjustScrollHash: state.notes.adjustScrollHash,
      scrollBeginingHash: state.notes.scrollBeginingHash,
      loading: state.notes.loading,
      pagination: state.notes.pagination
    },
    pages: {
      selectedPageID: state.pages.selectedPageID
    }
  }))

  const onScrollNext = () => {
    store.dispatch(fetchNotesThunk({
      search: context.commons.search,
      pageID: context.pages.selectedPageID,
    }))
  }

  if (
    context.notes.values.length === 0 &&
    ( 
      context.pages.selectedPageID === undefined ||
      context.pages.selectedPageID === null
    )
  ) {
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

            @media (prefers-color-scheme: light) {
              .change-color-in-svg {
                fill: var(--accent-8) !important;
              }
            }

            @media (prefers-color-scheme: dark) {
              .change-color-in-svg {
                fill: var(--accent-9) !important;
              }
            }
          `}
        />
        <Flex
          className={css`
            user-select: none;
            -webkit-user-drag: none;
          `}
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
      data-testid='notes-board'
      {...aditionalProps}
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
        loading={context.notes.loading}
        loadingElement={
          <Flex
            width='100%'
            justify='center'
            align='center'
          >
            <Spinner size='3' />
          </Flex>
        }
        renderItem={(item) => (
          <Note 
            data={item}
            minWidth='220px'
            minHeight='80px'
            maxWidth='720px'
          />
        )}
        getItemID={(item) => item.id}
        hasMore={context.notes.pagination.hasNextPage}
        inverse={true}
        next={onScrollNext}
        scrollBeginingHash={`${context.notes.scrollBeginingHash}`}
        adjustScrollHash={`${context.notes.adjustScrollHash}`}
        scrollbarSize='2'
      />
    </Flex>
  )
}

export default NotesBoard