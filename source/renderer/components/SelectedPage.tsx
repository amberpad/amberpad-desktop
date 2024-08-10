import React, { useState, useEffect, useRef } from 'react'
import { Box, Card, Flex, Heading } from '@radix-ui/themes'
import { css, injectGlobal } from '@emotion/css'

import store, { useStore } from '@renderer/utils/redux-store'
import type { BoxProps } from '@radix-ui/themes'

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

/* ----------------------------------------------
 * Generated by Animista on 2024-6-16 15:31:6
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation slide-out-blurred-left
 * ----------------------------------------
 */
@keyframes slide-out-blurred-left {
  0% {
    -webkit-transform: translateX(0) scaleY(1) scaleX(1);
            transform: translateX(0) scaleY(1) scaleX(1);
    -webkit-transform-origin: 50% 50%;
            transform-origin: 50% 50%;
    -webkit-filter: blur(0);
            filter: blur(0);
    opacity: 1;
    height: auto;
  }
  100% {
    -webkit-transform: translateX(-1000px) scaleX(2) scaleY(0.2);
            transform: translateX(-1000px) scaleX(2) scaleY(0.2);
    -webkit-transform-origin: 100% 50%;
            transform-origin: 100% 50%;
    -webkit-filter: blur(40px);
            filter: blur(40px);
    opacity: 0;
    padding: 0;
    height: 0;
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

  if (!isSidebarOpen) {
    return <></>
  }

  return (
    <Box
      {...boxProps}
      data-testid='selected-page'
      className={(() => {
        if (hasSelectedPage) {
          return css`
            background-color: red;
            max-height: 150px;
            animation: slide-in-blurred-left 0.6s cubic-bezier(0.230, 1.000, 0.320, 1.000) both;
          `
        } else {
          return css`
            background-color: blue;
            max-height: 150px;
            ${ignoreAnimation ? 
              `
                opacity: 0;
                padding: 0;
                height: 0;
              ` :
              `animation: slide-out-blurred-left 0.45s cubic-bezier(0.755, 0.050, 0.855, 0.060) both`
            };
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