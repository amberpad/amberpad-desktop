import React, { useEffect, useRef, useState } from 'react'
import { Flex, Section, Box, Separator, Callout, Heading, Quote, Blockquote } from '@radix-ui/themes'
import { css } from '@emotion/css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate } from '@fortawesome/free-solid-svg-icons'
import { useAppUpdater } from '@renderer/providers/AppUpdaterProvider'

export default function Updating() {
  const updater = useAppUpdater()

  return (
    <Flex
      width='100%'
      height='100dvh'
      display='flex'
      direction='column'
      gap='8'
      justify='start'
      align='stretch'
      overflow='hidden'
    >
      <Flex
        flexGrow='1'
        direction='column'
        justify='center'
        align='center'
        gap='4'
        p='4'
        wrap='wrap'
      >
        <Heading
          className={css`
            user-select: none;
            -webkit-user-drag: none;
          `}
          align='center'
          size='6'
        >
          <Quote>
            Please, don't worry so much. 
            Because in the end, none of us have very long on this Earth. 
            Life is fleeting.
          </Quote> 
        </Heading>
        <Heading
          align='center'
          size='6'
        >
          <Blockquote>Robin williams</Blockquote>
        </Heading>
      </Flex>

      <Flex
        direction='row'
        justify='center'
        align='center'
        gap='4'
        p='6'
        wrap='wrap'
      >
        <FontAwesomeIcon 
          className={css`
            color: var(--accent-a8);
            font-size: var(--font-size-6);
          ` + ' ' + 'fa-spin'}
          icon={faRotate}
        />
        <Heading
          className={css`
            user-select: none;
            -webkit-user-drag: none;
          `}
          align='center'
          size='6'
        >
          Installing Amberpad {updater.info ? `v${updater.info.version}` : ''}
        </Heading>
      </Flex>

    </Flex>
  );
}