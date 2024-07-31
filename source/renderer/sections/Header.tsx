import React, {} from 'react'
import { Flex, Section, Box, SectionProps } from '@radix-ui/themes';
import { css } from '@emotion/css';

/* @ts-ignore */
import SearchBar from '@renderer/components/SearchBar'

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
          <SearchBar />
        </Box>
      </Flex>
    </Section>
  )
}