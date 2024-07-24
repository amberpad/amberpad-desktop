import React, {} from 'react'
import { Flex, Section, Box, SectionProps } from '@radix-ui/themes';
import { css } from '@emotion/css';

import Searchbar from '@renderer/components/Searchbar'

export default function Header(
  sectionProps: SectionProps
) {
  return (
    <Section
      {...sectionProps}
      test-id='header'
      size='1'
    >
      <Flex
        display='flex'
        direction='row'
        gap='1'
        justify='center'
        align='center'
        px='6'
      >
        <Box
          flexGrow='1'
          maxWidth='768px'
        >
          <Searchbar />
        </Box>
      </Flex>
    </Section>
  )
}