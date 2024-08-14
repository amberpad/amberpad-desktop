import React, { useState, useEffect, useRef } from 'react'
import { Box, Card, Flex, Heading, IconButton } from '@radix-ui/themes'
import { css, injectGlobal } from '@emotion/css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import store, { useStore } from '@renderer/utils/redux-store'
import type { BoxProps } from '@radix-ui/themes'
import pagesSlice from '@renderer/actions/pages.slice';

injectGlobal`
/* ----------------------------------------------
 * Generated by Animista on 2024-6-16 15:28:50
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation slide-in-blurred-left
 * ----------------------------------------
 */
@keyframes slide-in-blurred-left {
  0% {
    -webkit-transform: translateX(-1000px) scaleX(2.5) scaleY(0.2);
            transform: translateX(-1000px) scaleX(2.5) scaleY(0.2);
    -webkit-transform-origin: 100% 50%;
            transform-origin: 100% 50%;
    -webkit-filter: blur(40px);
            filter: blur(40px);
    opacity: 0;
    padding: 0;
  }
  100% {
    -webkit-transform: translateX(0) scaleY(1) scaleX(1);
            transform: translateX(0) scaleY(1) scaleX(1);
    -webkit-transform-origin: 50% 50%;
            transform-origin: 50% 50%;
    -webkit-filter: blur(0);
            filter: blur(0);
    opacity: 1;
  }
}
`

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

  // Code to ignore the first animation so it doesnt slide-out an empty item in the first run
  const lastSelectedPage = useRef(hasSelectedPage)
  const ignoreAnimation = useRef(true)
  useEffect(() => { 
    if (!ignoreAnimation) {
      return
    }
    if (lastSelectedPage.current !== hasSelectedPage) {
      ignoreAnimation.current = false
    }
    lastSelectedPage.current = hasSelectedPage 
  }, [hasSelectedPage, ignoreAnimation])

  const onClose = () => {
    const { setSelectedPageID } = pagesSlice.actions
    store.dispatch(setSelectedPageID({ value: null }))
  }

  if (
    !isSidebarOpen || 
    !hasSelectedPage
  ) {
    return <></>
  }

  return (
    <Box
      {...boxProps}
      data-testid='selected-page'
      className={css`
        max-height: 150px;
        animation: slide-in-blurred-left 0.6s cubic-bezier(0.230, 1.000, 0.320, 1.000) both;
      `}
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
          direction='row'
          gap='4'
          justify='end'
          align='stretch'
        >
          <Flex
            flexBasis='0'
            flexGrow='1'
            direction='column'
            gap='1'
            justify='start'
            align='stretch'
          >
            <Heading
              className={css`
                @media (prefers-color-scheme: light) {
                  color: var(--accent-11);
                }
                @media (prefers-color-scheme: dark) {
                  color: var(--accent-9);
                }
              `}
              size='1'
              align='left'
              truncate={true}
            >
              {selectedPage ? selectedPage.notepad.name : ''}
            </Heading>
            <Heading
              size='5'
              align='left'
              truncate={true}
            >
              {selectedPage ? selectedPage.name : ''}
            </Heading>
          </Flex>

          <Flex
            direction='column'
            gap='0'
            justify='start'
            align='end'
          >
            <IconButton
              variant='ghost'
              onClick={onClose}
            >
              <FontAwesomeIcon
              color='var(--gray-9)'
                size='xs'
                icon={faXmark}
              />
            </IconButton>
          </Flex>
        </Flex>
      </Card>
    </Box>
  )
}