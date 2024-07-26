import React, { useState } from 'react'
import { Box, BoxProps, Callout, Flex, FlexProps } from "@radix-ui/themes"
import { css } from '@emotion/css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo, faWrench, faCheck, faXmark, faExclamation } from '@fortawesome/free-solid-svg-icons'

import { useAlert } from '@renderer/providers/AlertProvider'
import type { AlertType } from '@renderer/providers/AlertProvider'

const colorMap = {
  'info': 'yellow',
  'success': 'grass', 
  'alert': 'red', 
  'warning': 'orange',
  'system': 'gray',
}

const roleMap = {
  'info': 'status',
  'success': 'status', 
  'alert': 'alert', 
  'warning': 'status',
  'system': 'status'
}

const iconsMap = {
  'info': (
    <FontAwesomeIcon
      color={`var(--${colorMap['info']}-12)`}
      size='sm'
      icon={faInfo}
    />
  ),
  'success': (
    <FontAwesomeIcon
      color={`var(--${colorMap['success']}-12)`}
      size='sm'
      icon={faCheck}
    />
  ), 
  'alert': (
    <FontAwesomeIcon
      color={`var(--${colorMap['alert']}-12)`}
      size='sm'
      icon={faXmark}
    />
  ),
  'warning': (
    <FontAwesomeIcon
      color={`var(--${colorMap['warning']}-12)`}
      size='sm'
      icon={faExclamation}
    />
  ),
  'system': (
    <FontAwesomeIcon
      color={`var(--${colorMap['system']}-12)`}
      size='sm'
      icon={faWrench}
    />
  ),  
}

function Alert (
  {
    ...flexProps
  }: FlexProps & {
  }
) {
  const { content, type: alertType, isActive } = useAlert()

  return (
    <Flex
      {...flexProps}
      className={
        (() => {
         switch(isActive) {
          case true:
            return css`animation: fade-in 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;`
          case false:
            return css`animation: fade-out 0.5s ease-out both;`
          default:
            return css`display: none;`
         }
        })()
      }
      width='fit-content'
      maxWidth='620px'
      justify='center'
      align='center'
      asChild={true}
    >
      <Callout.Root
        className={css`
          background-color: var(--accent-2);
        `}
        color={colorMap[alertType] as any}
        role={roleMap[alertType]}
        size='1'
        variant="surface"
      >
        <Callout.Icon >
          {iconsMap[alertType]}
        </Callout.Icon>
        <Callout.Text>
          {content}
        </Callout.Text>
      </Callout.Root>
    </Flex>
  )
}

export default Alert