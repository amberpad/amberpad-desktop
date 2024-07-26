import React, { useState, useLayoutEffect } from 'react'
import { css, injectGlobal } from '@emotion/css'
import { Flex, Separator, Text, IconButton, Button, Box } from '@radix-ui/themes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'

import store from '@renderer/utils/redux-store'
import DropdownMenu from '@renderer/primitives/DropdownMenu'
import UpdatePage from '@renderer/dialogs/UpdatePage'
import DeletePage from '@renderer/dialogs/DeletePage'
import pagesSlice from '@renderer/actions/pages.slice'

import type { FlexProps } from '@radix-ui/themes'
import type { PageType } from "@ts/models/Pages.types"

injectGlobal`
  .page-YBdupuKlEX__options {
    opacity: 0.0;
  }
  .page-YBdupuKlEX:hover .page-YBdupuKlEX__options {
    opacity: 1.0;
  }

  .page-YBdupuKlEX__separator {
    width: 3px;
    height: 100%;
    border-left: 2px solid var(--accent-a3);
  }

  .page-YBdupuKlEX:hover .page-YBdupuKlEX__separator {
    border-left: 2px solid var(--accent-a9);
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
  const [state, setState] = useState({
    isUpdatePageOpen: false,
    isDeletePageOpen: false,
  })
  const [context, setContext] = useState({
    selectedPageID: undefined,
  })

  useLayoutEffect(() => {
    store.monitor(
      (state) => ({
        selectedPageID: state.pages.selectedPageID
      }), 
      (state) => {
        setContext({
          selectedPageID: state.pages.selectedPageID
        })
      }
    )
  }, [])

  const onPageClick = () => {
    const { setSelectedPageID } = pagesSlice.actions
    store.dispatch(setSelectedPageID({ 
      value: context.selectedPageID === data.id ?
        undefined :
        data.id
    }))
  }

  return (
    <>
      <>
        <UpdatePage.Root
          open={state.isUpdatePageOpen}
          onOpenChange={(isOpen) => setState((prev) => ({...prev, isUpdatePageOpen: isOpen}))}
        >
          <UpdatePage.Content page={data} />
        </UpdatePage.Root>
        <DeletePage.Root
          open={state.isDeletePageOpen}
          onOpenChange={(isOpen) => setState((prev) => ({...prev, isDeletePageOpen: isOpen}))}
        >
          <DeletePage.Content page={data} />
        </DeletePage.Root>
      </>
      <Flex 
        className='page-YBdupuKlEX'
        direction='row'
        gap='4'
        justify='start'
        align='center'
        {...flexProps}
      >
        <div
          data-testid='page-separator'
          className='page-YBdupuKlEX__separator'
        />
        <Box
          flexBasis='1'
          overflow='clip'
        >
          <Box
            maxWidth='100%'
            asChild={true}
          >
            <Button
              className={css`
                color: var(--amber-a9);

                :hover {
                  background-color: transparent;
                }
              `}
              variant='ghost'
              onClick={onPageClick}
            >
              <Text 
                size='2' 
                weight='medium'
                truncate={true}
              >
                {data.name}
              </Text>
            </Button>
          </Box>
        </Box>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
              <IconButton
                className='page-YBdupuKlEX__options'
                size='1'
                variant='ghost'
              >
                <FontAwesomeIcon
                  size='sm'
                  icon={faEllipsis}
                />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item
                onClick={() => setState((prev) => ({...prev, isUpdatePageOpen: true}))}
              >
                Rename
                <FontAwesomeIcon
                  size='sm'
                  icon={faPenToSquare}
                />
              </DropdownMenu.Item>
              <DropdownMenu.Item 
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
    </>
  )
}

export default Page