import React, { useMemo, useCallback } from 'react'
import { Descendant, createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { Box, Card, Flex } from '@radix-ui/themes'

import { widthAmberpadEditor } from '@renderer/utils/slate'
import TextEditorToolbar from '@renderer/components/TextEditor/Toolbar'

import type { DescendantType } from '@ts/slate.types'

const initialValue: DescendantType[] = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Second line.' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Third line.' }],
  },
]

/******************************************************************************
* Element rendering components
******************************************************************************/

const defaultElement = ({ attributes, children, element }) => (
  <p {...attributes}>
    {children}
  </p>
)

const TextElements = ({ attributes, children }) => ({
  'heading-one' : (
    <h1 {...attributes}>
      {children}
    </h1>
  ),
  'heading-two': (
    <h2 {...attributes}>
      {children}
    </h2>
  ),
  'heading-three': (
    <h3 {...attributes}>
      {children}
    </h3>
  ),
  'text-normal': (
    <p {...attributes}>
      {children}
    </p>
  )
})

const ListElements = ({ attributes, children, element }) => ({
  'numbered-list': (
    <ol {...attributes}>
      {children}
    </ol>
  ), 
  'bulleted-list': (
    <ul {...attributes}>
      {children}
    </ul>
  ),
  'list-item': (
    <li {...attributes}>
      {children}
    </li>
  )
})

const Element = (props) => {
  const { element } = props;
  const textElements = TextElements(props)
  const listElements = ListElements(props)
  return {
    ...textElements,
    ...listElements,
  }[element.type] || 
  defaultElement(props)
}

/******************************************************************************
* Leaf rendering components
******************************************************************************/

const Leaf = ({ attributes, children, leaf }) => {

  if (leaf['bold']) {
    children = <strong>{children}</strong>
  }

  if (leaf['inline-code']) {
    children = <code>{children}</code>
  }

  if (leaf['italic']) {
    children = <em>{children}</em>
  }

  if (leaf['underline']) {
    children = <u>{children}</u>
  }

  if (leaf['strikethrough']) {
    children = <s>{children}</s>
  }

  return <span {...attributes}>{children}</span>
}

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
          //onChange={value => console.log('CONTENT', JSON.stringify(value, undefined, 4))}
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
