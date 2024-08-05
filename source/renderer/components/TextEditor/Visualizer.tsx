import React, { useMemo, useCallback, useEffect } from 'react'
import { BaseEditor, Descendant, Node as SlateNode, createEditor } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { Box, Card, Flex } from '@radix-ui/themes'
import { css } from '@emotion/css'

import { AmberpadEditor, widthAmberpadEditor } from '@renderer/utils/slate'
import Element from './Element'
import Leaf from './Leaf'
import { DescendantType } from '@ts/slate.types'

/******************************************************************************
* Render text editor
******************************************************************************/

function Visualizer (
  {
    content=undefined,
    onContentChange=undefined,
    editorRef=undefined,
    ...slateProps
  }: Omit<Parameters<typeof Slate>[0], 'editor' | 'initialValue' | 'children'> & {
    content?: string,
    onContentChange?: (content: string) => void
    editorRef?: React.MutableRefObject<AmberpadEditor>
  }
) {
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => {
    const editor = widthAmberpadEditor(withReact(createEditor()))
    editorRef !== undefined && Object.assign(editorRef, { current: editor })
    return editor
  }, [])

  useEffect(() => {
    if (onContentChange) {
      editor.onVisualizerContentUpdate(onContentChange)
    }
  }, [editor, onContentChange])

  let slateContent: DescendantType[]
  let isContentValid: boolean
  try {
    slateContent = editor.fromJSON(content)
    isContentValid = SlateNode.isNodeList(slateContent)
  } catch (error) {
    slateContent = editor.buildContentFromString('')
    isContentValid = true
  }
  console.log('VISUALIZER')
  console.log('content', content)
  console.log('slateContent', slateContent)
  console.log('isContentValid', isContentValid)
  return (
    <Box
      width='100%'
      height='100%'
    >
      <Slate 
        {...slateProps}
        editor={editor}
        initialValue={
          content !== undefined && isContentValid ? 
            editor.fromJSON(content) :
            editor.buildContentFromString(content) 
        }
      >
        <Box
          minHeight='0'
          flexGrow='1'
          overflowX='clip'
          overflowY='auto'
          asChild={true}
        >
          <Editable
            readOnly={true}
            disableDefaultStyles={true}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            className={css`
              background-color: transparent;
            `}
          />
        </Box>
      </Slate>
    </Box>

  )
}

export default Visualizer
