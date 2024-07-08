import React, { useMemo, useCallback } from 'react'
import { Descendant, createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { Box, Card, Flex, Link, Tooltip } from '@radix-ui/themes'

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

const defaultElement = ({ attributes, children }) => (
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

const ListElements = ({ attributes, children }) => ({
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
  const { element, attributes, children } = props;
  const textElements = TextElements(props)
  const listElements = ListElements(props)

  return {
    ...textElements,
    ...listElements,
    'block-code': (
      <code {...attributes}>
        {children}
      </code>
    ),
    'block-quote': (
      <blockquote {...attributes}>
        {children}
      </blockquote>
    )
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

  if (leaf['italic']) {
    children = <em>{children}</em>
  }

  if (leaf['underline']) {
    children = <u>{children}</u>
  }

  if (leaf['inline-code']) {
    children = <code>{children}</code>
  }

  if (leaf['strikethrough']) {
    children = <s>{children}</s>
  }

  if (leaf['highlight']) {
    children = <mark>{children}</mark>
  }

  if (leaf['link']) {
    children = (
      <Tooltip
        content={
          <Link
            href='#'
            className='text-editor__content tooltip-link'
            onMouseDown={async (event) => {
              event.preventDefault()
              await window.electronAPI.general.openExternal({ 
                url: leaf['link'].url })
            }}
          >
            {leaf['link'].url}
          </Link>
        }
      >
        <Link
          style={{ cursor: 'text' }}
        >
          {children}
        </Link>
    </Tooltip>
    )
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
