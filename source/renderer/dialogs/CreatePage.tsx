import React, { useState, ReactNode, useEffect } from 'react'
import { 
  Dialog, 
  Flex, 
  Button,
  TextField,
  Text
} from '@radix-ui/themes'
import isHotkey from 'is-hotkey'

import store from "@renderer/utils/redux-store"
import { useAlert } from "@renderer/providers/AlertProvider"
import { createpageThunk } from "@renderer/actions/notepads.slice"
import AlertDialog, { AlertDialogProps }  from './AlertDialog'

import type { NotepadType } from "@ts/models/Notepads.types"

export default function CreateNotepad (
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
  
  const close = () => {
    setForm({
      name: ''
    })
    dialogProps.onOpenChange ?
      dialogProps.onOpenChange(false) :
      setState({open: false})
  }

  const createPage = () => {
    store.dispatch(createpageThunk({
      name: form.name,
      notepadID: notepad.id
    })).then(() => {
      show('Page created successfully', 'success')
    })
  }

  return (
    <AlertDialog
      {...dialogProps}
      title='Create page'
      open={open}
      onOpenChange={(open) => setState({ open })}
      onCancel={() => {
        close()
      }}
      onSuccess={() => {
        createPage()
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
              data-testid='page-modal-name-input'
              size='2'
              value={form.name}
              onChange={(event) => setForm({ name: event.target.value })}
            />
          </label>
        </Flex>
      }
    >
      {children}
    </AlertDialog>
  )
}