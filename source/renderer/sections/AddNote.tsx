import React, { useEffect, useState, useRef } from 'react'
import { Box, Flex, IconButton, TextArea } from '@radix-ui/themes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { css } from '@emotion/css'

import store from "@renderer/utils/redux-store"
import { createNoteThunk } from "@renderer/actions/notes.slice"
import ResizableSide from '@renderer/wrappers/ResizableSide'
import TextEditor from '@renderer/components/TextEditor/TextEditor'

import type { FlexProps  } from '@radix-ui/themes'
import type { AmberpadEditor } from '@renderer/utils/slate'

/* @ts-ignore */
const PLATFORM = navigator.userAgentData.platform

function AddNote ({
  ...flexProps
}: FlexProps & {
}) {
  const [state, setState] = useState({
    isTextEditorEmpty: true,
    addNoteIsFocused: false,
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

  const onFocusChange = (isFocused) => {
    setState((prev) => ({ 
      ...prev, 
      addNoteIsFocused: isFocused 
    }))
  }

  return (
    <Box
      width='100%'
      asChild={true}
    >
      <ResizableSide
        direction='top'
        minSize='100px'
        maxSize='520px'
        offsetpad='120px'
        isOpen={state.addNoteIsFocused}
        separator={
          <div
            className={css`
              width: 100%;
              border-bottom: 1px solid var(--accent-a3);

              :hover {
                border-bottom: 3px solid var(--accent-a3);
              }
            `}
          />
        }
      >
        <Box
          p='4'
          data-testid='add-note-content'
          width='100%'
          height='100%'
          overflow='clip'
        >
          <Flex
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
        </Box>
      </ResizableSide>
    </Box>
  )
}

export default AddNote