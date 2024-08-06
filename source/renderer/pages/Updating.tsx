import React, { useEffect, useRef, useState } from 'react'
import { Flex, Section, Box, Separator, Callout, Heading } from '@radix-ui/themes'
import { css } from '@emotion/css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate } from '@fortawesome/free-solid-svg-icons'

export default function Updating() {
  return (
    <Flex
      width='100%'
      height='100dvh'
      display='flex'
      direction='column'
      gap='0'
      justify='center'
      align='stretch'
    >
      <Box
        className={css`

        `}
      >
        <FontAwesomeIcon 
          className={css`
            
          ` + ' ' + 'fa-spin'}
          icon={faRotate}
        />
        <Heading>Installing Amberpad(0.2.0)...</Heading>
      </Box>
    </Flex>
  );
}