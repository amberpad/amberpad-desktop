import React from "react"

import store from "@src/store"
import { destroyPageThunk } from "@src/actions/notepads.slice"
import { useModal } from '@providers/Modal'
import Button from "@components/Button"
import styles from "@styles/delete-page-modal.module.css"

import type { Page } from "@ts/models/Pages.types"

export default function DeletePage({
  value,
  className='',
  onSuccess=()=>null,
  onCancel=()=>null,
}: {
  value: Page,
  onSuccess?: (...args: any[]) => any
  onCancel?: (...args: any[]) => any
  className?: string
}) {
  const { closeModal } = useModal()

  const deletePage = () => {
    store.dispatch(destroyPageThunk({
      value: value
    }))
  }

  const _onCancel = () => {
    onCancel()
    closeModal()
  }

  const _onSuccess = () => {
    deletePage()
    onSuccess()
    closeModal()
  }

  return (
    <div className={`${className} ${styles.container}`}>
    <div className={styles.container}>
      <p className={`secondary-p ${styles.content}`}>
        Are you sure you want to delete this item?
      </p>
      <div className={styles.options}>
        <Button
          label={'Cancel'}
          onClick={_onCancel}
        />
        <Button
          label={'Delete'}
          onClick={_onSuccess}
        />
      </div>
    </div>
    </div>
  )
}