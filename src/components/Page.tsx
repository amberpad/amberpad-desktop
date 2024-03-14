import React from 'react'
import { faEllipsisH, faTrash, faPen } from '@fortawesome/free-solid-svg-icons'

import DropdownMenu from "@components/DropdownMenu"
import IconButton from '@components/IconButton'
import styles from '@styles/page.module.css'

export default function Page ({
  className='',
  data={}
}: {
  className?: string,
  data: any
}) {
  return (
    <div className={`${className} ${styles.container}`}>
        <div className={styles['vertical-line']}></div>
        <p className={`secondary-p ${styles.label}`}>
          {data.name}
        </p>
        <DropdownMenu
          type='clickable'
          options={[
            {
              label: 'Edit',
              icon: faPen,
              onClick: () => {

              }
            },
            {
              label: 'Delete',
              icon: faTrash,
              onClick: () => {

              }
            }
          ]}
        >
          <IconButton
            className={styles['options-button']}
            icon={faEllipsisH}
          />
        </DropdownMenu>
    </div>
  )
}