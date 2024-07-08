import React, { useState } from 'react'
import { 
  Dialog, 
  Flex, 
  Button,
  TextField, 
  Text
} from '@radix-ui/themes'

import store from "@renderer/utils/redux-store"
import { updateNotepadThunk } from "@renderer/actions/notepads.slice"

import type { NotepadType } from "@ts/models/Notepads.types"

function CreateNotepadContent(
  {
    notepad,
    ...aditionalProps
  }: Parameters<typeof Dialog.Content>[0] & {
    notepad: NotepadType,
  }
) {
  const [state, setState] = useState({
    name: '',
  })

  const setFormValues = () => {
    setState({
      name: notepad.name,
    })
  }

  const clearForm = () => {
    setState({
      name: '',
    })
  }

  const updateNotepad = () => {
    store.dispatch(updateNotepadThunk({
      value: {
        ...notepad,
        ...state,
      }
    })).then(() => {
      // Show alert
    })
  }

  const _onCancel = () => {
    clearForm()
  }

  const _onSuccess = () => {
    updateNotepad()
    clearForm()
  }

  return (
    <Dialog.Content
      aria-describedby={undefined}
      onOpenAutoFocus={() => setFormValues()}
      {...aditionalProps}
    >
      <Dialog.Title size='2'>
        Update notepad
      </Dialog.Title>

      <Flex 
        direction='column'
        gap='3'
      >
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Name
          </Text>
          <TextField.Root 
            size='2'
            value={state.name}
            onChange={(event) => setState({ name: event.target.value })}
          />
        </label>
      </Flex>

      <Flex gap="3" mt="4" justify="end">
        <Dialog.Close>
          <Button
            variant="soft"
            color="gray"
            onClick={_onCancel}
          >
            Cancel
          </Button>
        </Dialog.Close>
        <Dialog.Close>
          <Button
            onClick={_onSuccess}
          >
            Save
          </Button>
        </Dialog.Close>
      </Flex>
    </Dialog.Content>
  )
}

export default {
  ...Dialog,
  Content: CreateNotepadContent,
}
