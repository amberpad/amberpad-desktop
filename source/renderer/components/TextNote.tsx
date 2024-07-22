import React, { useCallback } from "react"
import { Box } from "@radix-ui/themes"

import store from "@renderer/utils/redux-store"
import { updateNoteThunk } from "@renderer/actions/notes.slice"
import Visualizer from "@renderer/components/TextEditor/Visualizer"
import { NoteType } from '@ts/models/Notes.types'

function TextNote (
  { 
    data,
  }: { 
    data: NoteType 
  }
) {
  const onTextNodeUpdate = useCallback((content) => {
    store.dispatch(updateNoteThunk({
      value: {
        ...data,
        content: content
      },
    }))
  }, [])

  return (
    <Box
      width='100%'
    >
      <Visualizer 
        content={data.content}
        onContentChange={onTextNodeUpdate}
      />
    </Box>
  )
}

export default TextNote