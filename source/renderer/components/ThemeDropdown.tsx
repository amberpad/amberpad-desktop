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
    theme: state.commons.theme 
  }))
  /*
  const [context, setContext] = useState<{ theme: CommonsSliceState['theme'] }>({
    theme: 'os'
  })

  useEffect(() => {
    store.monitor(
      (state) => ({ theme: state.commons.theme }), 
      (state) => setContext({ theme: state.commons.theme })
    )
  }, [])
  */

  const setTheme = (theme: CommonsSliceState["theme"]) => {
    const { setTheme } = commonsSlice.actions
    store.dispatch(setTheme({ value: theme }))
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
      <DropdownMenu.Content>
        <DropdownMenu.Item
          className={css`
            border: ${context.theme === 'os' ? '1px solid var(--gray-a8)' : ''} 
          `}
          onClick={() => setTheme('os')}
        >
          <FontAwesomeIcon
            size='1x'
            icon={faCircleHalfStroke}
          />
          OS Default
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className={css`
            border: ${context.theme === 'light' ? '1px solid var(--gray-a8)' : ''} 
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
            border: ${context.theme === 'dark' ? '1px solid var(--gray-a8)' : ''} 
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