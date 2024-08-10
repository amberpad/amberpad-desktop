import React, {} from 'react'
import { Flex, Section, Box, SectionProps, Button } from '@radix-ui/themes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { css } from '@emotion/css';

/* @ts-ignore */
import SearchBar from '@renderer/components/SearchBar'
import VersionUpdatePopover from '@renderer/components/VersionUpdatePopover'
import ThemeDropdown from '@renderer/components/ThemeDropdown';

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
          flexBasis='auto'
          flexGrow='1'
          flexShrink='1'
          maxWidth='720px'
        >
          <SearchBar />
        </Box>
        <VersionUpdatePopover 
        />
        <ThemeDropdown 
          flexBasis='max-content'
          flexShrink='0'
          flexGrow='0'
        />
      </Flex>
    </Section>
  )
}