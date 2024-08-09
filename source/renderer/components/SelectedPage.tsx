import React, { useState, useEffect, useRef } from 'react'
import { Box, Card, Flex, Heading } from '@radix-ui/themes'
import { css } from '@emotion/css'

import store, { useStore } from '@renderer/utils/redux-store'
import type { BoxProps } from '@radix-ui/themes'

export default function SelectedPage ({
  className='',
  isSidebarOpen=true,
  ...boxProps
}: BoxProps & { 
  isSidebarOpen?: boolean 
}) {
  const context = useStore((state) => ({
    pages: {
      selectedPage: state.pages.selectedPage,
      loading: state.pages.loadingSelectedPage
    }
  }))
  /*
  const [context, setContext] = useState(() => {
    const initialState = store.getState()
    return {
      pages: {
        selectedPage: initialState.pages.selectedPage,
        loading: false,
      }
    }
  })

  useEffect(() => {
    store.monitor(
      (state) => ({
        selectedPage: state.pages.selectedPage,
        loading: state.pages.loadingSelectedPage
      }), 
      (state) => {
        setContext((prev) => ({
          pages: {
            // Selected is hidden by default, this will ignore any seting of undefined value
            // until setting an not undefined value
            selectedPage: (
              prev.pages.selectedPage === null && 
              !state.pages.selectedPage ?
                null :
                state.pages.selectedPage
            ),
            loading: state.pages.loadingSelectedPage
          }
        }))
      },
    )
  }, [])
  */

  const selectedPage = context.pages.selectedPage
  const hasSelectedPage = selectedPage !== undefined && selectedPage !== null
  return (
    <Box
      {...boxProps}
      data-testid='selected-page'
      className={(() => {
        if (selectedPage === null) {
          return css`
            max-height: 150px;
            display: none;
          `
        } else if (hasSelectedPage && isSidebarOpen) {
          return css`
            max-height: 150px;
            animation: slide-in-blurred-left 0.6s cubic-bezier(0.230, 1.000, 0.320, 1.000) both;
          `
        } else {
          return css`
            max-height: 150px;
            animation: slide-out-blurred-left 0.45s cubic-bezier(0.755, 0.050, 0.855, 0.060) both;
            height: 0;
          `
        }
      })() + ' ' + css`
        overflow: clip;
      `}
    >
      <Card
        className={css`
          background-color: var(--color-background);
          box-shadow: 0 0 2px 0 color-mix(in oklab, var(--accent-a5), var(--accent-5) 25%);

          ::before, ::after {
            content: none;
          }
        `}
        data-radius='none'
        variant='surface'
      >
        <Flex
          direction='column'
          gap='1'
          justify='center'
          align='stretch'
        >
          <Heading
            size='1'
            color='gray'
            align='right'
            truncate={true}
          >
            {selectedPage ? selectedPage.notepad.name : ''}
          </Heading>
          <Heading
            size='4'
            align='right'
            truncate={true}
          >
            {selectedPage ? selectedPage.name : ''}
          </Heading>
        </Flex>
      </Card>
    </Box>
  )
}