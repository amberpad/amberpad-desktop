import React, { useState, ReactNode } from 'react'
import isHotkey from 'is-hotkey'

import store from "@renderer/utils/redux-store"
import { useAlert } from "@renderer/providers/AlertProvider"
import { destroyNoteThunk } from "@renderer/actions/notes.slice"
import AlertDialog, { AlertDialogProps } from './AlertDialog'

import type { NoteType } from "@ts/models/Notes.types"


export default function DeleteNote (
  {
    note,
    children=undefined,
    ...dialogProps
  }: {
    note: NoteType,
    children?: ReactNode,
  } & AlertDialogProps
) {
  const { show } = useAlert()
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

  const destroyNote = () => {
    store.dispatch(destroyNoteThunk({ value: note })).then(() => {
      show('Note deleted successfully', 'success')
    })
  }

  return (
    <AlertDialog
      {...dialogProps}
      title='Delete note'
      description='Are you sure? this action cannot be undone.'
      open={open}
      onOpenChange={(open) => setState({ open })}
      onCancel={() => {
        close()
      }}
      onSuccess={() => {
        destroyNote()
        close()
      }}
    >
      {children}
    </AlertDialog>
  )
}
