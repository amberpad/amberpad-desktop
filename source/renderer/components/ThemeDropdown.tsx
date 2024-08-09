import React, { useEffect, useState } from "react";
import { IconButton } from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DropdownMenu from "@renderer/primitives/DropdownMenu";
import { css } from "@emotion/css";
import { faCircleHalfStroke, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

import store, { useStore } from "@renderer/utils/redux-store"
import commonsSlice, { CommonsSliceState } from "@renderer/actions/commons.slice";

export default function ThemeDropdown () {
  const context = useStore((state) => ({ 
    themeSource: state.commons.themeSource 
  }))

  const setTheme = (theme: CommonsSliceState['themeSource']) => {
    const { setThemeSource } = commonsSlice.actions
    store.dispatch(setThemeSource({ value: theme }))
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton
          variant='ghost'
        >
          <FontAwesomeIcon
            size='1x'
            icon={faCircleHalfStroke}
          />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        data-accent='gray'
      >
        <DropdownMenu.Item
          className={css`
            border: ${context.themeSource === 'system' ? '1px solid var(--gray-a8)' : ''} 
          `}
          onClick={() => setTheme('system')}
        >
          <FontAwesomeIcon
            size='1x'
            icon={faCircleHalfStroke}
          />
          OS Default
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className={css`
            border: ${context.themeSource === 'light' ? '1px solid var(--gray-a8)' : ''} 
          `}
          onClick={() => setTheme('light')}
        >
          <FontAwesomeIcon
            size='1x'
            icon={faSun}
          />
          Light
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className={css`
            border: ${context.themeSource === 'dark' ? '1px solid var(--gray-a8)' : ''} 
          `}
          onClick={() => setTheme('dark')}
        >
          <FontAwesomeIcon
            size='1x'
            icon={faMoon}
          />
          Dark
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}