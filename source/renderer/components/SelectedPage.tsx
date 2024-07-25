import React, { useState, useEffect } from 'react'
import { Box, Card, Flex, Heading } from '@radix-ui/themes'

import store from '@renderer/utils/redux-store'

import type { BoxProps } from '@radix-ui/themes'
import { css } from '@emotion/css'

export default function SelectedPage ({
  className='',
  isSidebarOpen=true,
  ...boxProps
}: BoxProps & { 
  isSidebarOpen?: boolean 
}) {
  const [context, setContext] = useState({
    pages: {
      selectedPage: undefined,
      loading: false,
    }
  })

  useEffect(() => {
    store.monitor(
      (state) => ({
        selectedPage: state.pages.selectedPage,
        loading: state.pages.loadingSelectedPage
      }), 
      (state) => {
        setContext({
          pages: {
            selectedPage: state.pages.selectedPage,
            loading: state.pages.loadingSelectedPage
          }
        })
      },
    )
  }, [])

  const selectedPage = context.pages.selectedPage
  const hasSelectedPage = selectedPage !== undefined
  return (
    <Box
      data-testid='selected-page'
      py='6'
      {...boxProps}
      className={css`
        max-height: 150px;
        ${!hasSelectedPage || !isSidebarOpen ? 
          'animation: slide-out-blurred-left 0.45s cubic-bezier(0.755, 0.050, 0.855, 0.060) both;':
          'animation: slide-in-blurred-left 0.6s cubic-bezier(0.230, 1.000, 0.320, 1.000) both;'
        }
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