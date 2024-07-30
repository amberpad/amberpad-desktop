import React, { ReactNode, useEffect, useState } from 'react'
import { 
  Dialog, 
  Flex, 
  Button,
  TextField, 
  Text
} from '@radix-ui/themes'

import store from "@renderer/utils/redux-store"
import { useAlert } from "@renderer/providers/AlertProvider"
import { updateNotepadThunk } from "@renderer/actions/notepads.slice"
import AlertDialog, { AlertDialogProps }  from './AlertDialog'

import type { NotepadType } from "@ts/models/Notepads.types"

export default function UpdateNotepad (
  {
    notepad,
    children=undefined,
    ...dialogProps
  }: {
    notepad: NotepadType,
    children?: ReactNode
  } & AlertDialogProps
) {
  const { show } = useAlert()
  const [form, setForm] = useState({
    name: ''
  })
  const [state, setState] = useState({
    open: dialogProps.open,
  })
  const open = (
    dialogProps.onOpenChange ? 
      dialogProps.open :
      state.open
  )

  useEffect(() => {
    if (notepad || open) {
      setForm({
        name: notepad.name,
      })
    }
  },[notepad, open])

  const close = () => {
    setForm({
      name: ''
    })
    dialogProps.onOpenChange ?
      dialogProps.onOpenChange(false) :
      setState({open: false})
  }

  const updateNotepad = () => {
    store.dispatch(updateNotepadThunk({
      value: {
        ...notepad,
        ...form,
      }
    })).then(() => {
      show('Notepad updated successfully', 'success')
    })
  }

  return (
    <AlertDialog
      {...dialogProps}
      title='Edit notepad'
      open={open}
      onOpenChange={(open) => setState({ open })}
      onCancel={() => {
        close()
      }}
      onSuccess={() => {
        updateNotepad()
        close()
      }}
      content={
        <Flex 
        direction='column'
        gap='3'
      >
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Name
          </Text>
          <TextField.Root
            data-testid='notepad-modal-name-input'
            size='2'
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
        </label>
      </Flex>
      }
    >
      {children}
    </AlertDialog>
  )
}
