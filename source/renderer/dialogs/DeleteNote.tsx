import React, { useState } from 'react'
import { 
  AlertDialog,
  Button,
  Flex, 
} from '@radix-ui/themes'

import store from "@renderer/utils/redux-store"
import { useAlert } from "@renderer/providers/AlertProvider"
import { destroyNoteThunk } from "@renderer/actions/notes.slice"

import type { NoteType } from "@ts/models/Notes.types"

function DeleteNoteContent(
  {
    note,
    ...aditionalProps
  }: Parameters<typeof AlertDialog.Content>[0] & {
    note: NoteType,
  }
) {
  const { show } = useAlert()

  const destroyNote = () => {
    store.dispatch(destroyNoteThunk({ value: note })).then(() => {
      show('Note deleted successfully', 'success')
    })
  }

  const _onCancel = () => {
  }

  const _onSuccess = () => {
    destroyNote()
  }

  return (
    <AlertDialog.Content
      {...aditionalProps}
    >
      <AlertDialog.Title size='2'>
        Delete note
      </AlertDialog.Title>
      <AlertDialog.Description size="2">
        Are you sure? this action cannot be undone.
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
  Content: DeleteNoteContent,
}