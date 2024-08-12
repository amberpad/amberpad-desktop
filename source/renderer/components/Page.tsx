import React, { useState, useLayoutEffect } from 'react'
import { css, injectGlobal } from '@emotion/css'
import { Flex, Separator, Text, IconButton, Button, Box } from '@radix-ui/themes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'

import store, { useStore }  from '@renderer/utils/redux-store'
import DropdownMenu from '@renderer/primitives/DropdownMenu'
import UpdatePage from '@renderer/dialogs/UpdatePage'
import DeletePage from '@renderer/dialogs/DeletePage'
import pagesSlice from '@renderer/actions/pages.slice'

import type { FlexProps } from '@radix-ui/themes'
import type { PageType } from "@ts/models/Pages.types"

injectGlobal`
  .page__options {
    opacity: 0.0;
  }
  .page:hover .page__options {
    opacity: 1.0;
  }

  .page__bullet {
    width: 3px;
    border-left: 2px solid var(--gray-a5);
  }

  .page:hover .page__bullet {
    border-left: 2px solid var(--accent-a3);
  }

  @media (prefers-color-scheme: light) {
    .page {
      padding-left: var(--space-3);
    }

    .page:hover {
      background-color: var(--accent-a3);
      text-decoration-line: underline;
    }

    .page__bullet {
      display: none;
    } 
  }

  @media (prefers-color-scheme: dark) {
    .page__bullet {
      width: 3px;
      border-left: 3px solid var(--accent-a5);
    }

    .page:hover .page__bullet {
      border-left: 3px solid var(--accent-a9);
    }
  }
`

function Page ({
  data,
  loading=false,
  ...flexProps
} : FlexProps & {
  data: PageType,
  loading?: boolean,
}) {
  const context = useStore((state) => ({
    selectedPageID: state.pages.selectedPageID
  }))
  const [state, setState] = useState({
    isUpdatePageOpen: false,
    isDeletePageOpen: false,
  })

  const onPageClick = () => {
    const { setSelectedPageID } = pagesSlice.actions
    store.dispatch(setSelectedPageID({ 
      value: context.selectedPageID === data.id ?
        null :
        data.id
    }))
  }

  return (
    <>
      <>
        <UpdatePage
          page={data}
          open={state.isUpdatePageOpen}
          onOpenChange={(isOpen) => setState((prev) => ({...prev, isUpdatePageOpen: isOpen}))}
        />
        <DeletePage
          page={data}
          open={state.isDeletePageOpen}
          onOpenChange={(isOpen) => setState((prev) => ({...prev, isDeletePageOpen: isOpen}))}
        />
      </>
      <Flex
        data-testid='page'
        className={`page 
          ${context.selectedPageID === data.id ? css`
            @media (prefers-color-scheme: light) {
              background-color: var(--accent-a3);
            }

            @media (prefers-color-scheme: dark) {
              background-color: var(--accent-a3);
            }
          ` : ''}
        `}
        direction='row'
        gap='4'
        justify='start'
        align='stretch'
        {...flexProps}
      >
        <div
          className='page__bullet'
        />
        <Flex
          flexBasis='1'
          py='1'
          overflow='clip'
          align='center'
          justify='center'
        >
          <Box
            maxWidth='100%'
            asChild={true}
          >
            <Button
              className={css`
                color: var(--gray-11);
                
                :hover {
                  background-color: transparent;
                }

                @media (prefers-color-scheme: dark) {
                  color: var(--gray-12);
                }
              `}
              variant='ghost'
              onClick={onPageClick}
            >
              <Text 
                size='1' 
                weight='medium'
                truncate={true}
              >
                {data.name}
              </Text>
            </Button>
          </Box>
        </Flex>
        <Flex
          justify='center'
          align='center'
        >
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
              <IconButton
                data-testid='page-options-button'
                className='page__options'
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
              data-testid='page-options-menu'
            >
              <DropdownMenu.Item
                data-testid='page-options-edit-page-button'
                onClick={() => setState((prev) => ({...prev, isUpdatePageOpen: true}))}
              >
                Rename
                <FontAwesomeIcon
                  size='sm'
                  icon={faPenToSquare}
                />
              </DropdownMenu.Item>
              <DropdownMenu.Item 
                data-testid='page-options-delete-page-button'
                color="red"
                onClick={() => setState((prev) => ({...prev, isDeletePageOpen: true}))}
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
      </Flex>
    </>
  )
}

export default Page