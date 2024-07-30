import React, { useState, ReactNode } from 'react'
import { Button, Flex, Text, TextField } from '@radix-ui/themes'

import store from "@renderer/utils/redux-store"
import { useAlert } from "@renderer/providers/AlertProvider"
import { destroyNotepadThunk } from "@renderer/actions/notepads.slice"
import AlertDialog, { AlertDialogProps } from './AlertDialog'

import type { NotepadType } from "@ts/models/Notepads.types"


export default function UpdateLink (
  {
    children=undefined,
    initial={},
    onConfirm=undefined,
    ...dialogProps
  }: {
    children?: ReactNode,
    initial?: {[key: string]: any},
    onConfirm?: (link: string) => void,
  } & AlertDialogProps
) {
  const [form, setForm] = useState({
    link: initial.link || '',
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
    dialogProps.onOpenChange ?
      dialogProps.onOpenChange(false) :
      setState({ open: false })
  }

  return (
    <AlertDialog
      {...dialogProps}
      title='Update link'
      open={open}
      onOpenChange={(open) => setState({ open })}
      cancel={
        <Button
          variant="soft"
          color="gray"
        >
          Cancel
        </Button>
      }
      onCancel={() => {
        close()
      }}
      success={
        <Button
          data-testid='modal-confirm-button'
          disabled={form.link === ''}
        >
          Save
        </Button>
      }
      onSuccess={() => {
        onConfirm(form.link)
        close()
      }}
      content={
        <Flex 
        direction='column'
        gap='3'
      >
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            URL
          </Text>
          <TextField.Root 
            size='2'
            value={form.link}
            onChange={(event) => setForm({ link: event.target.value })}
          />
        </label>
      </Flex>
      }
    >
      {children}
    </AlertDialog>
  )
}
