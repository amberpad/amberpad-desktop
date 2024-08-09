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
    commons: {
      theme: state.commons.theme
    },
    pages: {
      selectedPage: state.pages.selectedPage,
      loading: state.pages.loadingSelectedPage
    }
  }))

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
      })()}
    >
      <Card
        className={css`
          @media (prefers-color-scheme: light) {
            background-color: var(--accent-a2);
            border: 1px solid var(--gray-a3);
            box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
          }

          @media (prefers-color-scheme: dark) {
            border: 1px solid var(--accent-a5);
            background-color: var(--color-background);
            box-shadow: inset var(--accent-a5) 0px 0px var(--space-2) -3px; 
          }

          ::before, ::after {
            content: none;
          }
        `}
        data-radius={context.commons.theme === 'light' ? 'small' : 'none'}
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