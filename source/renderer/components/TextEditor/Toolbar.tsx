import React, { useEffect, useMemo, useRef, useState }  from "react"
//import { useSlate } from 'slate-react'
import { Flex, IconButton, Select, Tooltip } from "@radix-ui/themes"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
  faHighlighter
} from '@fortawesome/free-solid-svg-icons'

import AddURL from "@renderer/dialogs/AddURL"
import { useAmberpadEditor } from "@renderer/utils/slate"
/*
import {
  AmberpadEditor,
  toggleBlock,
  getTextElementTypesInSelection, 
  toggleMark,
  isBlockActive,
  isMarkActive,
  isSelectionCollpased,
  toggleLinkMark,
  isLinkMarkActive,
} from "@renderer/utils/slate"
 */

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

const ToolbarButton = React.forwardRef((
{
  className,
  disabled,
  checked=undefined,
  ...iconButtonProps
}: IconButtonProps & {
  checked?: boolean,
},
ref: React.LegacyRef<HTMLButtonElement>,
) => (
  <IconButton
    ref={ref}
    variant='ghost'
    className={[
      !!checked ? 'text-editor__button--checked' : '',
      !!disabled ? 'text-editor__button--disabled': '', 
    ].join(' ')}
    disabled={disabled}
    {...iconButtonProps}
  />
))

const MarkButton = (
  { 
    format,
    ...iconButtonProps 
  }: IconButtonProps & { format: string }
) => {
  const editor = useAmberpadEditor()
  return (
    <ToolbarButton
      checked={editor.isMarkActive(format)}
      onMouseDown={event => {
        event.preventDefault()
        editor.toggleMark(format)
      }}
      {...iconButtonProps }
    />
  )
}

const URLButton = (
  iconButtonProps: IconButtonProps
) => {
  const editor = useAmberpadEditor()

  const applyMark = (url) => {
    editor.toggleLinkMark(url)
  }

  //isLinkMarkActive
  const _isSelectionCollapsed = editor.isSelectionCollpased()
  const isButtonEnabled = _isSelectionCollapsed === null ? false : !_isSelectionCollapsed
  return (
    <AddURL.Root 
      open={isButtonEnabled ? undefined : false}
    >
      <AddURL.Trigger>
        <ToolbarButton
          disabled={!isButtonEnabled}
          {...iconButtonProps }
        />
      </AddURL.Trigger>
      <AddURL.Content 
        onSuccess={applyMark}
      />
    </AddURL.Root>
  )
}

const BlockButton = (
  { 
    format,
    ...iconButtonProps 
  }: IconButtonProps & { format: string }
) => {
  const editor = useAmberpadEditor()
  return (
    <ToolbarButton
      className={ editor.isBlockActive(format) && 'text-editor__button--checked' }
      onMouseDown={event => {
        event.preventDefault()
        editor.toggleBlock(format)
      }}
      {...iconButtonProps }
    />
  )
}

const ToolbarTextWeightSelect = () => {
  const editor = useAmberpadEditor()
  const items: { 
    format: string, 
    label: string,
  }[] = useMemo(() => [
    { format: 'heading-one', label: 'Heading 1' },
    { format: 'heading-two', label: 'Heading 2' },
    { format: 'heading-three', label: 'Heading 3' },
  ], [])
  const [state, setState] = useState({
    value: '',
    checked: false,
  })

  useEffect(() => {
    const onSelectListener = () => {
      const textTypesInSelection = editor.getTextElementTypesInSelection()
      if (textTypesInSelection.length === 1) {
        const type = textTypesInSelection[0] as string
        setState((prev) => ({
          ...prev,
          value: type === 'paragraph' ? '' : type,
          checked: type !== 'paragraph'
        }))
      } else if (textTypesInSelection.length > 1) {
        setState((prev) => ({
          ...prev,
          value: '',
          checked: true,
        }))
      }
    }
    editor.setOnOperationListener('set_selection', onSelectListener)
   return () => {
    editor.removeOnOperationListener('set_selection', onSelectListener)
   }
  }, [])

  const onItemClick = (format) => {
    editor.toggleBlock(format)
    setState((prev) => ({
      ...prev,
      value: prev.value === format ? '' : format,
      checked: true,
    }))
  }

  return (
    <Tooltip 
      content='Heading'
      open={false}
    >
    <Flex
      className="text-editor__select"
      direction='row'
      justify='center'
      align='center'
    >
      <Select.Root 
        defaultValue=''
        value={state.value}
      >
        <Select.Trigger
          variant='ghost'
          className={state.checked && 'text-editor__button--checked'}
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
        <Select.Content>
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
      px='1'
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
        <MarkButton format="highlight">
          <FontAwesomeIcon
            size='sm'
            icon={faHighlighter}
          />
        </MarkButton>
      </ToolbarGroup>

      <ToolbarGroup>
        <URLButton>
          <FontAwesomeIcon
            size='sm'
            icon={faLink}
            transform={'shrink-2'}
          />
        </URLButton>
        <BlockButton format='block-quote'>
          <FontAwesomeIcon
            size='sm'
            icon={faQuoteRight}
          />
        </BlockButton>
        <MarkButton format="inline-code">
          <FontAwesomeIcon
            size='sm'
            icon={faCode}
          />
        </MarkButton>
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