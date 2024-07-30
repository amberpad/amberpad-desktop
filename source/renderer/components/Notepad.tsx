import React, { useState } from 'react'
import { css, injectGlobal } from '@emotion/css'
import { Box, Flex, IconButton, Text } from '@radix-ui/themes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faEllipsis, faPlus } from '@fortawesome/free-solid-svg-icons'

import DropdownMenu from '@renderer/primitives/DropdownMenu'
import Page from '@renderer/components/Page'
import CreatePage from '@renderer/dialogs/CreatePage'
import UpdateNotepad from '@renderer/dialogs/UpdateNotepad'
import DeleteNotepad from '@renderer/dialogs/DeleteNotepad'

import type { FlexProps } from '@radix-ui/themes'
import type { NotepadType } from "@ts/models/Notepads.types"
import { PageType } from '@ts/models/Pages.types'

injectGlobal`
  .notepad-lavr8Nx04e__options {
    opacity: 0.0;
  }

  .notepad-lavr8Nx04e:hover .notepad-lavr8Nx04e__options {
    opacity: 1.0;
  }
`

function Notepad ({
  data,
  loading=false,
  ...flexProps
} : FlexProps & {
  data: NotepadType,
  loading?: boolean,
}) {
  const [state, setState] = useState({
    isCreatePageOpen: false,
    isUpdateNotepadOpen: false,
    isDeleteNotepadOpen: false,
  })

  return (
    <>
      <>
        <CreatePage
          notepad={data}
          open={state.isCreatePageOpen}
          onOpenChange={(isOpen) => setState((prev) => ({...prev, isCreatePageOpen: isOpen}))}
        />
        <UpdateNotepad
          notepad={data}
          open={state.isUpdateNotepadOpen}
          onOpenChange={(isOpen) => setState((prev) => ({...prev, isUpdateNotepadOpen: isOpen}))}
        />
        <DeleteNotepad
          notepad={data}
          open={state.isDeleteNotepadOpen}
          onOpenChange={(isOpen) => setState((prev) => ({...prev, isDeleteNotepadOpen: isOpen}))}
        />
      </>
      <Flex
        data-testid='notepad'
        direction='column'
        gap='2'
        justify='start'
        align='stretch'
        {...flexProps}
      >

        <Flex 
          className={`notepad-lavr8Nx04e`}
          direction='row'
          gap='4'
          justify='start'
          align='center'
        >
          <Text
            className={css`
              user-select: none;
              -webkit-user-drag: none;
            `}
            size='2' 
            weight='bold'
            truncate={true}
          >
            {data.name}
          </Text>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <IconButton
                data-testid='notepad-options-button'
                className={'notepad-lavr8Nx04e__options'}
                size='1'
                variant='ghost'
              >
                <FontAwesomeIcon
                  size='sm'
                  icon={faEllipsis}
                />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              data-testid='notepad-options-menu'
            >
              <DropdownMenu.Item
                data-testid='notepad-options-create-page-button'
                onClick={() => setState((prev) => ({...prev, isCreatePageOpen: true}))}
              >
                Add page
                <FontAwesomeIcon
                  size='sm'
                  icon={faPlus}
                />
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item
                data-testid='notepad-options-edit-notepad-button'
                onClick={() => setState((prev) => ({...prev, isUpdateNotepadOpen: true}))}
              >
                Rename
                <FontAwesomeIcon
                  size='sm'
                  icon={faPenToSquare}
                />
              </DropdownMenu.Item>
              <DropdownMenu.Item 
                data-testid='notepad-options-delete-notepad-button'
                color="red"
                onClick={() => setState((prev) => ({...prev, isDeleteNotepadOpen: true}))}
              >
                Delete
                <FontAwesomeIcon
                  size='sm'
                  icon={faTrashCan}
                />
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Flex>
        <Flex
          direction='column'
          gap='0'
          justify='start'
          align='stretch'
        >
          {
            (data.pages ? data.pages : []).map((item: PageType) => (
              <Page 
                key={item.id} 
                data={item} 
              />
            ))
          }
        </Flex>
      </Flex>
    </>
  )
}

export default Notepad