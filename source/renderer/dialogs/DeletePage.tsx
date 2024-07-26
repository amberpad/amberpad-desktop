import React, { useState } from 'react'
import { 
  AlertDialog,
  Button,
  Flex, 
} from '@radix-ui/themes'

import store from "@renderer/utils/redux-store"
import { useAlert } from "@renderer/providers/AlertProvider"
import { destroyPageThunk } from "@renderer/actions/notepads.slice"

import type { PageType } from "@ts/models/Pages.types"

function DeletePageContent(
  {
    page,
    ...aditionalProps
  }: Parameters<typeof AlertDialog.Content>[0] & {
    page: PageType,
  }
) {
  const { show } = useAlert()

  const destroyPage = () => {
    store.dispatch(destroyPageThunk({ value: page })).then(() => {
      show('Page deleted successfully', 'success')
    })
  }

  const _onCancel = () => {
  }

  const _onSuccess = () => {
    destroyPage()
  }

  return (
    <AlertDialog.Content
      {...aditionalProps}
    >
      <AlertDialog.Title size='2'>
        Delete page
      </AlertDialog.Title>
      <AlertDialog.Description size="2">
        Are you sure? all the notes associated with this notepad will also be deleted.
      </AlertDialog.Description>
      <Flex gap="3" mt="4" justify="end">
        <AlertDialog.Cancel>
          <Button 
            variant="soft" 
            color="gray"
            onClick={_onCancel}
          >
            Cancel
          </Button>
        </AlertDialog.Cancel>
        <AlertDialog.Action>
          <Button 
            variant="solid" 
            color="red"
            onClick={_onSuccess}
          >
            Delete
          </Button>
        </AlertDialog.Action>
      </Flex>
    </AlertDialog.Content>
  )
}

export default {
  ...AlertDialog,
  Content: DeletePageContent,
}