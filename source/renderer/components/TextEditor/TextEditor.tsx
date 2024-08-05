import React, { useMemo, useCallback, useEffect, useState } from 'react'
import { BaseEditor, Descendant, Node as SlateNode, createEditor } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { withHistory } from 'slate-history'
import { Box, Card, Flex } from '@radix-ui/themes'
import isHotkey from 'is-hotkey'
import { css } from '@emotion/css'

import { AmberpadEditor, widthAmberpadEditor } from '@renderer/utils/slate'
import TextEditorToolbar from './Toolbar'
import Element from './Element'
import Leaf from './Leaf'

/******************************************************************************
* Render text editor
******************************************************************************/

function TextEditor (
  {
    slateEditorRef=undefined,
    onIsEmptyChange=undefined,
    onHotkeyEvent=undefined,
    hotkeys=['mod+enter'],
    ...slateProps
  }: Omit<Parameters<typeof Slate>[0], 'editor' | 'initialValue' | 'children'> & {
    slateEditorRef?: React.MutableRefObject<AmberpadEditor>,
    onIsEmptyChange?: (value: Boolean) => void,
    onHotkeyEvent?: (string) => void,
    hotkeys?: string[],
  }
) {
  const [isFocused, setIsFocused] = useState({})
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => {
    const editor = widthAmberpadEditor(withHistory(withReact(createEditor())))
    if (slateEditorRef !== undefined) {
      slateEditorRef.current = editor
    }
    return editor
  }, [])


  const onKeyDown = useCallback((event) => {
    const hotkey = hotkeys.find((item) => isHotkey(item, event))
    if (hotkey && onHotkeyEvent) {
      onHotkeyEvent(hotkey)
    }
  }, [])

  return (
    <Box
      data-testid='text-editor-container'
      width='100%'
      height='100%'
      className={css`
        border: 1px solid  var(--gray-a5);
        border-radius: var(--radius-1);
        padding: var(--space-2);
        background-color: var(--color-background);
        z-index: -1;
      `}
    >
      <Slate 
        {...slateProps}
        editor={editor} 
        initialValue={editor.buildContentFromString('')}
      >
        <Flex
          width='100%'
          height='100%'
          direction='column'
          justify='start'
          align='stretch'
          gap='1'
        >
          <TextEditorToolbar />
          <Box
            className={css`
                --scrollarea-scrollbar-size: var(--space-1);
                --scrollarea-scrollbar-border-radius: max(var(--radius-1), var(--radius-full));

                ::-webkit-scrollbar {
                  width: var(--scrollarea-scrollbar-size);
                  height: var(--scrollarea-scrollbar-size);
                }

                ::-webkit-scrollbar-track {
                  background-color: var(--gray-a3);
                  border-radius: var(--scrollarea-scrollbar-border-radius);
                }

                ::-webkit-scrollbar-thumb {
                  background-color: var(--gray-a8);
                  border-radius: var(--scrollarea-scrollbar-border-radius);
                }
            `}
            minHeight='0'
            flexGrow='1'
            asChild={true}
            overflowX='clip'
            overflowY='auto'
          >
            <Editable
              data-testid='add-note-textarea'
              className={css`
                padding: var(--space-2);
                outline: none;
              `}
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              onKeyDown={isFocused && onKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </Box>
        </Flex>
      </Slate>
    </Box>

  )
}

export default TextEditor
