import React from 'react'
import store from '@renderer/utils/redux-store'
import { css } from '@emotion/css'
import { Box, Flex, Heading, IconButton } from '@radix-ui/themes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLayerGroup, faPlus } from '@fortawesome/free-solid-svg-icons'

import commonsSlice from '@renderer/actions/commons.slice'
import CreateNotepad from '@renderer/dialogs/CreateNotepad'

import type { FlexProps } from '@radix-ui/themes'

function SidebarHeader({
  isSidebarOpen=true,
  ...flexProps
}: FlexProps & { 
  isSidebarOpen?: boolean
}) {

  const toggleIsSidebarOpen = () => {
    const { toggleIsSidebarOpen } = commonsSlice.actions
    store.dispatch(toggleIsSidebarOpen())
  }

  return (
    <Flex
      data-testid='sidebar-header'
      direction='row'
      p='2'
      gap='4'
      justify='start'
      align='center'
      overflow='clip'
      {...flexProps}
    >
      <Box
        asChild={true}
      >
        <IconButton
          size='1'
          variant='ghost'
          onClick={toggleIsSidebarOpen}
        >
          <FontAwesomeIcon
            size='1x'
            icon={faLayerGroup}
          />
        </IconButton>
      </Box>
      <Box
        className={!isSidebarOpen && css`
          display: none;
        `}
        minWidth='0'
        flexGrow='1'
        flexShrink='1'
      >
        <Heading
          size='2'
          weight='bold'
          wrap='nowrap'
          style={{
            overflowX: 'clip'
          }}
        >
          Notepads / Pages
        </Heading>
      </Box>
      
      <CreateNotepad>
        <Box
          className={!isSidebarOpen && css`
            display: none;
          `}
          asChild={true}
        >
          <IconButton
            size='1'
            variant='ghost'
          >
            <FontAwesomeIcon
              size='1x'
              icon={faPlus}
            />
          </IconButton>
        </Box>
      </CreateNotepad>

    </Flex>
  )
}

export default SidebarHeader

/*
      <CreateNotepad.Root>
        <CreateNotepad.Trigger>
          <Box
            className={!isSidebarOpen && css`
              display: none;
            `}
            asChild={true}
          >
            <IconButton
              size='1'
              variant='ghost'
            >
              <FontAwesomeIcon
                size='1x'
                icon={faPlus}
              />
            </IconButton>
          </Box>
        </CreateNotepad.Trigger>
        <CreateNotepad.Content
          maxWidth='520px'
        />
      </CreateNotepad.Root>
*/