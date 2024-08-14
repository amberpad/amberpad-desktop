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

import UpdateLink from "@renderer/dialogs/UpdateLink"
import { useAmberpadEditor } from "@renderer/utils/slate"

import type { FlexProps, IconButtonProps } from "@radix-ui/themes"
import { useAlert } from "@renderer/providers/AlertProvider"
import { css } from "@emotion/css"

const FONTAWESOME_ICON_SIZE = 'xs'

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
      gap='3'
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
      css` 
        color: var(--text-color)
      `
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

const URLMarkButton = (
  iconButtonProps: IconButtonProps
) => {
  const editor = useAmberpadEditor()
  const { show } = useAlert()

  const applyMark = (link) => {
    editor.toggleLinkMark(link)
    show('Link added successfully', 'success')
  }

  const isButtonEnabled = editor.isLinkButtonEnabled()
  return (
    <UpdateLink 
      onConfirm={applyMark}
      open={isButtonEnabled ? undefined : false}
    >
      <ToolbarButton
        disabled={!isButtonEnabled}
        {...iconButtonProps }
      />
    </UpdateLink>
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
      checked={editor.isBlockActive(format)}
      onMouseDown={event => {
        event.preventDefault()
        editor.toggleBlock(format)
      }}
      {...iconButtonProps }
    />
  )
}



const ListBlockButton = (
  { 
    format,
    ...iconButtonProps 
  }: IconButtonProps & { format: string }
) => {
  const editor = useAmberpadEditor()

  return (
    <ToolbarButton
      checked={editor.isBlockListActive(format)}
      onMouseDown={event => {
        event.preventDefault()
        editor.toggleListBlock(format)
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

  const onItemClick = (format) => {
    editor.toggleTextBlock(format)
  }

  const textTypes = editor.getTextTypes()
  const isButtonEnabled = (textTypes.length === 1 && textTypes[0] !== 'paragraph') || 
    textTypes.length > 1
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
        value={
          (
            textTypes.length === 1 && 
            textTypes[0] !== 'paragraph'
          ) ? 
            textTypes[0] : 
            null
        }
      >
        <Select.Trigger
          variant='ghost'
          className={isButtonEnabled && 'text-editor__button--checked'}
          placeholder={
            <FontAwesomeIcon
              size={FONTAWESOME_ICON_SIZE}
              icon={faHeader}
            /> as any
          }
        >
          <FontAwesomeIcon
            size={FONTAWESOME_ICON_SIZE}
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
  const editor = useAmberpadEditor()
  return (
    <Flex
      ref={ref}
      {...flexProps}
      direction='row'
      justify='start'
      align='center'
      gap='6'
      px='1'
    >
      <ToolbarGroup>
        <ToolbarTextWeightSelect />
      </ToolbarGroup>

      <ToolbarGroup>
        <MarkButton format="bold">
          <FontAwesomeIcon
            size={FONTAWESOME_ICON_SIZE}
            icon={faBold}
          />
        </MarkButton>
        <MarkButton format="italic">
          <FontAwesomeIcon
            size={FONTAWESOME_ICON_SIZE}
            icon={faItalic}
          />
        </MarkButton>
        <MarkButton format="underline">
          <FontAwesomeIcon
            size={FONTAWESOME_ICON_SIZE}
            icon={faUnderline}
          />
        </MarkButton>
        <MarkButton format="strikethrough">
          <FontAwesomeIcon
            size={FONTAWESOME_ICON_SIZE}
            icon={faStrikethrough}
          />
        </MarkButton>
        <MarkButton format="highlight">
          <FontAwesomeIcon
            size={FONTAWESOME_ICON_SIZE}
            icon={faHighlighter}
          />
        </MarkButton>
      </ToolbarGroup>

      <ToolbarGroup>
        <URLMarkButton>
          <FontAwesomeIcon
            size={FONTAWESOME_ICON_SIZE}
            icon={faLink}
            transform={'shrink-2'}
          />
        </URLMarkButton>
        <MarkButton format="inline-code">
          <FontAwesomeIcon
            size={FONTAWESOME_ICON_SIZE}
            icon={faCode}
          />
        </MarkButton>
        <BlockButton format='block-quote'>
          <FontAwesomeIcon
            size={FONTAWESOME_ICON_SIZE}
            icon={faQuoteRight}
          />
        </BlockButton>
      </ToolbarGroup>

      <ToolbarGroup>
        <ListBlockButton format='bulleted-list'>
          <FontAwesomeIcon
            size={FONTAWESOME_ICON_SIZE}
            icon={faListUl}
          />
        </ListBlockButton>
        <ListBlockButton format='numbered-list'>
          <FontAwesomeIcon
            size={FONTAWESOME_ICON_SIZE}
            icon={faListOl}
          />
        </ListBlockButton>
        <ListBlockButton format='check-list'>
          <FontAwesomeIcon
            size={FONTAWESOME_ICON_SIZE}
            icon={faListCheck}
          />
        </ListBlockButton>
      </ToolbarGroup>
    </Flex>
  )
})

export default Toolbar