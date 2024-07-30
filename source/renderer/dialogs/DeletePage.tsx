import React, { useState, ReactNode } from 'react'
import isHotkey from 'is-hotkey'

import store from "@renderer/utils/redux-store"
import { useAlert } from "@renderer/providers/AlertProvider"
import { destroyPageThunk } from "@renderer/actions/notepads.slice"
import AlertDialog, { AlertDialogProps } from './AlertDialog'

import type { PageType } from "@ts/models/Pages.types"


export default function DeleteNote (
  {
    page,
    children=undefined,
    ...dialogProps
  }: {
    page: PageType,
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

  const destroyPage = () => {
    store.dispatch(destroyPageThunk({ value: page })).then(() => {
      show('Page deleted successfully', 'success')
    })
  }

  return (
    <AlertDialog
      {...dialogProps}
      title='Delete note'
      description='Are you sure? all the notes associated with this page will also be deleted.'
      open={open}
      onOpenChange={(open) => setState({ open })}
      onCancel={() => {
        close()
      }}
      onSuccess={() => {
        destroyPage()
        close()
      }}
    >
      {children}
    </AlertDialog>
  )
}
