import React from "react"
import { faEllipsisH, faTrash, faPen, faPlus } from '@fortawesome/free-solid-svg-icons'

import ElipsisSpinner from "@src/components/spinners/ElipsisSpinner"
import UpdateNotepad from '@components/modals/UpdateNotepad'
import DeleteNotepad from '@components/modals/DeleteNotepad'
import { useModal } from '@providers/Modal'
import CreatePage from '@components/modals/CreatePage'
import DropdownMenu from "@components/DropdownMenu"
import Page from '@components/Page'
import IconButton from '@components/IconButton'
import styles from '@styles/notepad.module.css'
import type { Notepad } from "@ts/models/Notepads.types"

export default function Notepad ({
  data,
  className='',
  id='',
  loading=false,
}: {
  data: Notepad,
  className?: string,
  id?: string,
  loading?: boolean,
}) {
  const { showModal } = useModal()

  return (
    <div 
      className={[
        className,
        styles.container,
        __ENVIRONMENT__ === 'testing' ? 'class:notepad:8iwbWkd5Y1' : ''
      ].join(' ')}
      id={id}
    >
      <div className={styles.header}>
        <h4 className={`secondary-h4 ${styles.label}`}>
          { data.name } 
        </h4>
        <DropdownMenu
          className={__ENVIRONMENT__ === 'testing' ? 'class:notepad-options-button:GrWzrbooC9' : ''}
          options={[
            {
              label: 'New Page',
              icon: faPlus,
              className: __ENVIRONMENT__ === 'testing' ? 'class:notepad-options-create-page-button:LLAk9dX9bP' : '',
              onClick: () => showModal(
                <CreatePage 
                  notepad={data}
                />, 'New Page'
              )
            },
            {
              label: 'Edit',
              icon: faPen,
              className: __ENVIRONMENT__ === 'testing' ? 'class:notepad-options-edit-button:OJSSF5T46S' : '',
              onClick: () => showModal(
                <UpdateNotepad
                  value={data}
                />, 
                'Edit Notepad'
              )
            },
            {
              label: 'Delete',
              icon: faTrash,
              className: __ENVIRONMENT__ === 'testing' ? 'class:notepad-options-delete-button:r6ukcuDrQL' : '',
              onClick: () => showModal(
                <DeleteNotepad 
                  value={data}
                />, 
                'Delete Notepad'
              )
            }
          ]}
        >
          <IconButton
            className={styles['options-button']}
            icon={faEllipsisH}
          />
        </DropdownMenu>
      </div>

      <div className={styles.content}>
        {
          data.pages.map((item: any, index: number) => (
            <Page 
              key={index} 
              data={item} 
            />
          ))
        }
        {
          loading ? 
          (
            <div className={styles['loader-row']}>
              <ElipsisSpinner />
            </div>
          ) : 
          null
        }
      </div>
    </div>
  )
}
