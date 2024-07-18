import React, { useMemo, useCallback } from 'react'
import { Descendant, createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { Box, Card, Flex } from '@radix-ui/themes'

import { widthAmberpadEditor } from '@renderer/utils/slate'
import TextEditorToolbar from './Toolbar'
import Element from './Element'
import Leaf from './Leaf'

import type { DescendantType } from '@ts/slate.types'

const initialValue: DescendantType[] = [
  {
      "type": "bulleted-list",
      "children": [
          {
              "type": "list-item",
              "children": [
                  {
                      "type": "paragraph",
                      "children": [
                          {
                              "text": "First"
                          }
                      ]
                  }
              ]
          },
          {
              "type": "list-item",
              "children": [
                  {
                      "type": "paragraph",
                      "children": [
                          {
                              "text": "Second"
                          }
                      ]
                  }
              ]
          },
          {
              "type": "list-item",
              "children": [
                  {
                      "type": "paragraph",
                      "children": [
                          {
                              "text": "Third"
                          }
                      ]
                  }
              ]
          }
      ]
  },
  {
      "type": "paragraph",
      "children": [
          {
              "text": "Text"
          }
      ]
  },
  {
    "type": "paragraph",
    "children": [
        {
            "text": "Another Text"
        }
    ]
  },
  {
    "type": "paragraph",
    "children": [
        {
            "text": "Yet Another Text"
        }
    ]
  },
  {
      "type": "numbered-list",
      "children": [
          {
              "type": "list-item",
              "children": [
                  {
                      "type": "paragraph",
                      "children": [
                          {
                              "text": "Fourth"
                          }
                      ]
                  }
              ]
          },
          {
              "type": "list-item",
              "children": [
                  {
                      "type": "paragraph",
                      "children": [
                          {
                              "text": "Fifth"
                          }
                      ]
                  }
              ]
          },
          {
              "type": "list-item",
              "children": [
                  {
                      "type": "paragraph",
                      "children": [
                          {
                              "text": "Sixth"
                          }
                      ]
                  }
              ]
          }
      ]
  }
]

/******************************************************************************
* Render text editor
******************************************************************************/

function TextEditor () {
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withReact(widthAmberpadEditor(createEditor())), [])

  return (
    <Box
      width='100%'
      height='100%'
      asChild={true}
    >
      <Card
        className='text-editor__frame'
        variant='surface'
      >
        <Slate 
          editor={editor} 
          initialValue={initialValue as Descendant[]}
          //onChange={(value) => console.log(JSON.stringify(value, undefined, 4))}
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
              className='scroll-area'
              minHeight='0'
              flexGrow='1'
              asChild={true}
              overflowX='clip'
              overflowY='auto'
            >
              <Editable 
                className='text-editor__content'
                renderElement={renderElement}
                renderLeaf={renderLeaf}
              />
            </Box>
          </Flex>
        </Slate>
      </Card>
    </Box>

  )
}

export default TextEditor
