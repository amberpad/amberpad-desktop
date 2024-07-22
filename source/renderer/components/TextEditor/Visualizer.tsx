import React, { useMemo, useCallback, useEffect } from 'react'
import { BaseEditor, Descendant, Node as SlateNode, createEditor } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { Box, Card, Flex } from '@radix-ui/themes'

import { AmberpadEditor, widthAmberpadEditor } from '@renderer/utils/slate'
import TextEditorToolbar from './Toolbar'
import Element from './Element'
import Leaf from './Leaf'

import { css } from '@emotion/css'
import { DescendantType } from '@ts/slate.types'

/******************************************************************************
* Render text editor
******************************************************************************/

function Visualizer (
  {
    content=undefined,
    onContentChange=undefined,
    ...slateProps
  }: Omit<Parameters<typeof Slate>[0], 'editor' | 'initialValue' | 'children'> & {
    content?: string,
    onContentChange?: (content: string) => void
  }
) {
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => widthAmberpadEditor(withReact(createEditor())), [])

  const onChange = useCallback(() => {
    editor.onVisualizerContentUpdate(() => {
      onContentChange && onContentChange(editor.toJSON())
    })
  }, [])

  return (
    <Box
      width='100%'
      height='100%'
    >
      <Slate 
        {...slateProps}
        editor={editor}
        onChange={onChange}
        initialValue={content !== undefined ? 
          editor.fromJSON(content) :
          editor.initialValue 
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
