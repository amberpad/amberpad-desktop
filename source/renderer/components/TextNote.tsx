import React, { useCallback } from "react"
import { Box } from "@radix-ui/themes"

import store from "@renderer/utils/redux-store"
import { useAlert } from "@renderer/providers/AlertProvider"
import { updateNoteThunk } from "@renderer/actions/notes.slice"
import Visualizer from "@renderer/components/TextEditor/Visualizer"
import { NoteType } from '@ts/models/Notes.types'

import type { AmberpadEditor } from "@renderer/utils/slate"

function TextNote (
  { 
    data,
    editorRef=undefined,
  }: { 
    data: NoteType 
    editorRef?: React.MutableRefObject<AmberpadEditor>
  }
) {
  const { show } = useAlert()

  const onTextNodeUpdate = useCallback((content) => {
    store.dispatch(updateNoteThunk({
      value: {
        ...data,
        content: content
      },
    })).then(() => {
      show('Note updated successfully', 'success')
    })
  }, [])

  return (
    <Box
      width='100%'
    >
      <Visualizer 
        editorRef={editorRef}
        content={data.content}
        onContentChange={onTextNodeUpdate}
      />
    </Box>
  )
}

export default TextNote