import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard } from '@fortawesome/free-regular-svg-icons'
import { faPen, faLinkSlash } from '@fortawesome/free-solid-svg-icons'
import { Box, Code, Em, Flex, HoverCard, IconButton, Link, Strong, Text, Tooltip } from '@radix-ui/themes'

import UpdateLink from "@renderer/dialogs/UpdateLink"
import { useAmberpadEditor } from '@renderer/utils/slate'
import { css } from '@emotion/css'

function LinkLeaf (props) {
  let { attributes, children, leaf } = props;
  const link = leaf['link']
  const editor = useAmberpadEditor()

  const copyClipboard = () => {
    navigator.clipboard.writeText(leaf['link'])
    // Show alert
  }

  return (
    <HoverCard.Root
      open={!!leaf['_hovered'] }
    >
      <HoverCard.Trigger>
        <Link
          {...attributes}
          className={css`
            cursor: text;
          `}
        >
          {children}
        </Link>
      </HoverCard.Trigger>
      <HoverCard.Content>
        <Flex
          direction='row'
          justify='center'
          align='center'
          maxWidth='180px'
          gap='2'
        >
          <Box
            flexGrow='1'
            overflow='clip'
            asChild={true}
          >
            <Link
              color='indigo'
              href='#'
              size='1'
              truncate={true}
              onMouseDown={async (event) => {
                event.preventDefault()
                await window.electronAPI.general.openExternal({ 
                  url: link })
              }}
            >
              {link}
            </Link>
          </Box>
          <Flex 
            direction='row'
            justify='start'
            align='center'
            gap='3'
          >
            <Tooltip
              content='Copy link'
            >
              <IconButton
                className='text-color'
                variant='ghost'
                size='2'
                onMouseDown={copyClipboard}
              >
                <FontAwesomeIcon
                  size='xs'
                  icon={faClipboard}
                />
              </IconButton>
            </Tooltip>
            <UpdateLink.Root>
              <UpdateLink.Trigger>
                <Flex>
                  <Tooltip
                    content='Edit link'
                  >
                    <IconButton
                      className='text-color'
                      variant='ghost'
                      size='2'
                    >
                      <FontAwesomeIcon
                        size='xs'
                        icon={faPen}
                      />
                    </IconButton>
                  </Tooltip>
                </Flex>
              </UpdateLink.Trigger>
              <UpdateLink.Content 
                initial={{ link }}
                onSuccess={(link) => editor.updateHoveredLink(link)}
              />
            </UpdateLink.Root>

            <Tooltip
              content='Remove link'
            >
              <IconButton
                className='text-color'
                variant='ghost'
                size='2'
                onMouseDown={() => editor.removeHoveredLink()}
              >
                <FontAwesomeIcon
                  size='xs'
                  icon={faLinkSlash}
                />
              </IconButton>
            </Tooltip>
          </Flex>

        </Flex>
      </HoverCard.Content>
    </HoverCard.Root>
  )
}

export default function Leaf (props) {
  let { attributes, children, leaf } = props;

  if (leaf['bold']) {
    children = <Strong {...attributes}>{children}</Strong>
  }

  if (leaf['italic']) {
    children = <Em {...attributes}>{children}</Em>
  }

  if (leaf['underline']) {
    children = <u {...attributes}>{children}</u>
  }

  if (leaf['inline-code']) {
    children = <Code {...attributes}>{children}</Code>
  }

  if (leaf['strikethrough']) {
    children = <s {...attributes}>{children}</s>
  }

  if (leaf['highlight']) {
    children = (
      <mark
        {...attributes}
        className={css`
          background-color: var(--accent-10);
          color: var(--accent-contrast);
        `}
      >
        {children}
      </mark>
    )
  }

  if (leaf['link']) {
    children = (
      <LinkLeaf {...props}>
        {children}
      </LinkLeaf>
    )
  }

  return (
    <span
      {...attributes}
    >
      {children}
    </span>
  )
}