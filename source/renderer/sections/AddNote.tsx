import React, { useEffect, useState, useRef } from 'react'
import { Box, Flex, IconButton, TextArea } from '@radix-ui/themes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

import store from "@renderer/utils/redux-store"
import { createNoteThunk } from "@renderer/actions/notes.slice"
import TextEditor from '@renderer/components/TextEditor/TextEditor'

import type { FlexProps  } from '@radix-ui/themes'
import { useSlate } from 'slate-react'
import { BaseEditor } from 'slate'

import type { AmberpadEditor } from '@renderer/utils/slate'

/* @ts-ignore */
const PLATFORM = navigator.userAgentData.platform

function AddNote ({
  onFocusChange=undefined,
  ...flexProps
}: FlexProps & {
  onFocusChange?: (value: boolean) => void
}) {
  const [state, setState] = useState({
    isTextEditorEmpty: true,
  })
  const [context, setContext] = useState({
    selectedPageID: undefined,
  })

  useEffect(() => {
    store.monitor(
      (state) => ({
        selectedPageID: state.pages.selectedPageID
      }), 
      (state) => {
        setContext({
          selectedPageID: state.pages.selectedPageID
        })
      }
    )
  }, [])

  /**************************************************************************** 
  * Listens to keyboard comands to send input
  ****************************************************************************/

  /*
  const platformKey = (PLATFORM === 'macOS' ? 'Meta' : 'Control')
  const keyMap = useRef<{[key: string]: boolean}>({
    [platformKey]: false,
    'Enter': false,
  })
  const onKeyDown = (event: any) => {
    if (event.key in keyMap.current)
      keyMap.current[event.key] = true

    if (Object.values(keyMap.current).every((item) => item)) {
      createNote()
      Object.keys(keyMap.current).forEach((key) => keyMap.current[key] = false)
    }
  }
  
  const onKeyUp = (event: any) => {
    if (event.key in keyMap.current)
      keyMap.current[event.key] = false
  }
  */

  /**************************************************************************** 
  * SlateJS methods
  ****************************************************************************/
  const slateEditorRef = useRef<AmberpadEditor>()

  const createNote = async () => {
    if (
      slateEditorRef.current !== undefined &&
      !slateEditorRef.current.isEmpty()
    ) {
      const editor = slateEditorRef.current 
      store.dispatch(createNoteThunk({
        content: editor.toJSON(),
        pageID: context.selectedPageID || null,
      })).then(() => {
        // Show success
        editor.clear()
      })
    }
  }

  useEffect(() => {
    let listener
    if (slateEditorRef.current !== undefined) {
      const editor = slateEditorRef.current 
      listener = () => {
        const isEmpty = editor.isEmpty()
        setState((prev) => ({
          ...prev, 
          isTextEditorEmpty: editor.isEmpty() 
        }))
      }
      editor.setOnChangeListener(listener)
    }
    return () => {
      if (slateEditorRef.current !== undefined && listener) {
        const editor = slateEditorRef.current
        editor.removeOnChangeListener(listener)
      }
    }
  }, [slateEditorRef.current])

  return (
    <Flex
      data-testid='add-note'
      width='100%'
      height='100%'
      direction='row'
      gap='2'
      justify='end'
      align='stretch'
      onFocus={() => onFocusChange(true)}
      onBlur={() => onFocusChange(false)}
      {...flexProps}
    >
      <Box 
        minWidth='0'
        flexGrow='1'
      >
        <TextEditor 
          slateEditorRef={slateEditorRef}
        />
      </Box>
      <Flex
        direction='column'
        gap='2'
        justify='end'
        align='center'
      >
        <IconButton
          data-radius='full'
          size='2'
          disabled={state.isTextEditorEmpty}
          onClick={createNote}
        >
          <FontAwesomeIcon
            size='1x'
            icon={faPaperPlane}
          />
        </IconButton>
      </Flex>

    </Flex>
  )
}

export default AddNote