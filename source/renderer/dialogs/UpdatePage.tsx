import React, { useState, useEffect, ReactNode } from 'react'
import { 
  Dialog, 
  Flex, 
  Button,
  TextField, 
  Text
} from '@radix-ui/themes'

import store from "@renderer/utils/redux-store"
import { useAlert } from "@renderer/providers/AlertProvider"
import { updatePageThunk } from "@renderer/actions/notepads.slice"
import AlertDialog, { AlertDialogProps }  from './AlertDialog'

import type { PageType } from "@ts/models/Pages.types"

export default function UpdatePage (
  {
    page,
    children=undefined,
    ...dialogProps
  }: {
    page: PageType,
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
    if (page || open) {
      setForm({
        name: page.name,
      })
    }
  },[page, open])

  const close = () => {
    setForm({
      name: ''
    })
    dialogProps.onOpenChange ?
      dialogProps.onOpenChange(false) :
      setState({ open: false })
  }

  const updatePage = () => {
    store.dispatch(updatePageThunk({
      value: {
        ...page,
        name: form.name,
      }
    })).then(() => {
      show('Page updated successfully', 'success')
    })
  }

  return (
    <AlertDialog
      {...dialogProps}
      title='Edit page'
      open={open}
      onOpenChange={(open) => setState({ open })}
      onCancel={() => {
        close()
      }}
      onSuccess={() => {
        updatePage()
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
