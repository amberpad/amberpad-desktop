import React, { useEffect, useMemo, useRef, useState }  from "react"
import {
  Editor,
  Transforms,
  Element as SlateElement,
} from 'slate'
import { useSlate } from 'slate-react'
import { Flex, IconButton, Select, Text, Tooltip } from "@radix-ui/themes"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSquare, 
} from '@fortawesome/free-regular-svg-icons'
import { 
  faHeader, 
  faBold, 
  faItalic, 
  faUnderline, 
  faStrikethrough,
  faCode,
  faListOl,
  faListCheck,
  faListUl,
  faQuoteRight,
  faLink,
} from '@fortawesome/free-solid-svg-icons'

import { 
  getTextElementNodesInSelection,
  AmberpadEditor,
  toggleTextBlock,
  toggleListBlock, 
  toggleMark,
} from "@renderer/utils/slate"

import type { ElementType, NodeType } from "@ts/slate.types"
import type { FlexProps, IconButtonProps } from "@radix-ui/themes"

/******************************************************************************
* Secondary components
******************************************************************************/

const ToolbarGroup = React.forwardRef((
  {
    ...flexProps
  }: FlexProps & {},
  ref: React.LegacyRef<HTMLDivElement>
) => {
  return (
    <Flex
      direction='row'
      justify='start'
      align='center'
      gap='2'
      ref={ref}
      {...flexProps}
    />
  )
})

const ToolbarButton = (
iconButtonProps: IconButtonProps
) => (
  <IconButton
    variant='ghost'
    {...iconButtonProps }
  />
)

const BlockButton = (
  { 
    format,
    ...iconButtonProps 
  }: IconButtonProps & { format: string }
) => {
  const editor = useSlate()
  return (
    <ToolbarButton
      onMouseDown={event => {
        event.preventDefault()
        toggleListBlock(editor, format)
      }}
      {...iconButtonProps }
    />
  )
}

const MarkButton = (
  { 
    format,
    ...iconButtonProps 
  }: IconButtonProps & { format: string }
) => {
  const editor = useSlate()
  return (
    <ToolbarButton
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
      {...iconButtonProps }
    />
  )
}

const ToolbarTextWeightSelect = () => {
  const editor = useSlate() as AmberpadEditor
  const items: { 
    format: string, 
    label: string,
  }[] = useMemo(() => [
    { format: 'heading-one', label: 'Heading 1' },
    { format: 'heading-two', label: 'Heading 2' },
    { format: 'heading-three', label: 'Heading 3' },
  ], [])
  const [state, setState] = useState({
    textWeight: ''
  })

  useEffect(() => {
    const onSelectListener = (operation) => {
      const nodes = getTextElementNodesInSelection(editor)
      //console.log('SELECTION CHANGE')
      //console.log('Nodes:', JSON.stringify(nodes, undefined, 2))

    }
    editor.setOnOperationListener('set_selection', onSelectListener)
   return () => {
    editor.removeOnOperationListener('set_selection', onSelectListener)
   }
  }, [])

  const onItemClick = (format) => {
    toggleTextBlock(editor, format)
    setState((prev) => ({
      ...prev,
      textWeight: prev.textWeight === format ? '' : format
    }))
  }

  return (
    <Tooltip 
      content='Heading'
      open={false}
    >
    <Flex
      className="text-editor__weight-select"
      direction='row'
      justify='center'
      align='center'
    >
      <Select.Root 
        defaultValue=''
        value={state.textWeight}
      >
        <Select.Trigger 
          variant='ghost'
          placeholder={
            <FontAwesomeIcon
              size='sm'
              icon={faHeader}
            /> as any
          }
        >
          <FontAwesomeIcon
            size='sm'
            icon={faHeader}
          />
        </Select.Trigger>
        <Select.Content variant='soft' >
          {
            items.map(item => (
              <Select.Item
                key={item.format}
                value={item.format}
                onMouseDown={(event) => {
                  event.preventDefault()
                  onItemClick(item.format)
                }}
              >
                {item.label}
              </Select.Item>
            ))
          }
        </Select.Content>
      </Select.Root>
    </Flex>
    </Tooltip>
  )
}

/******************************************************************************
* Renderer component
******************************************************************************/

const Toolbar = React.forwardRef(function (
  {
    ...flexProps
  }: FlexProps,
  ref: React.LegacyRef<HTMLDivElement>
) {
  return (
    <Flex
      ref={ref}
      {...flexProps}
      direction='row'
      justify='start'
      align='center'
      gap='4'
    >
      <ToolbarGroup>
        <ToolbarTextWeightSelect />
      </ToolbarGroup>

      <ToolbarGroup>
        <MarkButton format="bold">
          <FontAwesomeIcon
            size='sm'
            icon={faBold}
          />
        </MarkButton>
        <MarkButton format="italic">
          <FontAwesomeIcon
            size='sm'
            icon={faItalic}
          />
        </MarkButton>
        <MarkButton format="underline">
          <FontAwesomeIcon
            size='sm'
            icon={faUnderline}
          />
        </MarkButton>
        <MarkButton format="strikethrough">
          <FontAwesomeIcon
            size='sm'
            icon={faStrikethrough}
          />
        </MarkButton>
      </ToolbarGroup>

      <ToolbarGroup>
        <MarkButton format="inline-code">
          <FontAwesomeIcon
            size='sm'
            icon={faCode}
          />
        </MarkButton>
        <BlockButton format='block-code'>
          <span className="fa-layers fa-fw">
            <FontAwesomeIcon
              size='sm'
              icon={faSquare}
              transform={'grow-4'}
            />
            <FontAwesomeIcon
              size='sm'
              icon={faCode}
              transform={'shrink-8'}
            />
          </span>
        </BlockButton>
        <BlockButton format='block-quote'>
          <FontAwesomeIcon
            size='sm'
            icon={faQuoteRight}
          />
        </BlockButton>
        <BlockButton format='link'>
          <FontAwesomeIcon
            size='sm'
            icon={faLink}
            transform={'shrink-2'}
          />
        </BlockButton>
        
      </ToolbarGroup>

      <ToolbarGroup>
        <BlockButton format='bulleted-list'>
          <FontAwesomeIcon
            size='sm'
            icon={faListUl}
          />
        </BlockButton>
        <BlockButton format='numbered-list'>
          <FontAwesomeIcon
            size='sm'
            icon={faListOl}
          />
        </BlockButton>
        <BlockButton format='check-list'>
          <FontAwesomeIcon
            size='sm'
            icon={faListCheck}
          />
        </BlockButton>
      </ToolbarGroup>
    </Flex>
  )
})

export default Toolbar