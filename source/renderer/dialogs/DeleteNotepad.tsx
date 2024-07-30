import React, { useState, ReactNode } from 'react'
import isHotkey from 'is-hotkey'

import store from "@renderer/utils/redux-store"
import { useAlert } from "@renderer/providers/AlertProvider"
import { destroyNotepadThunk } from "@renderer/actions/notepads.slice"
import AlertDialog, { AlertDialogProps } from './AlertDialog'

import type { NotepadType } from "@ts/models/Notepads.types"


export default function DeleteNotepad (
  {
    notepad,
    children=undefined,
    ...dialogProps
  }: {
    notepad: NotepadType,
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

  const destroyNotepad = () => {
    store.dispatch(destroyNotepadThunk({ value: notepad })).then(() => {
      show('Notepad deleted successfully', 'success')
    })
  }

  return (
    <AlertDialog
      {...dialogProps}
      title='Delete notepad'
      description='Are you sure? all the notes and pages associated with this notepad will also be deleted.'
      open={open}
      onOpenChange={(open) => setState({ open })}
      onCancel={() => {
        close()
      }}
      onSuccess={() => {
        destroyNotepad()
        close()
      }}
    >
      {children}
    </AlertDialog>
  )
}