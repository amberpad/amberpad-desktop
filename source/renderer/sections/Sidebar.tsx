import React, { useCallback, useEffect, useState } from 'react'
import { Box, Flex, ScrollArea, } from '@radix-ui/themes'
import _ from 'lodash'
import { css } from '@emotion/css';

import store, { useStore } from '@renderer/utils/redux-store'
import commonsSlice, { 
  commonsSliceInitials,
  fetchInitialIsSidebarOpen 
} from '@renderer/actions/commons.slice'
import ResizableSide from '@renderer/wrappers/ResizableSide'
import SidebarContent from '@renderer/sections/SidebarContent'

import type { BoxProps } from '@radix-ui/themes'

function Sidebar(boxProps: BoxProps) {
  const context = useStore((state) => ({
    commons:  {
      isSidebarOpen: state.commons.isSidebarOpen,
      initialIsSidebarOpen: state.commons.initialIsSidebarOpen,
    }
  }))
  const [state, setState] = useState({
    sidebarInitialAperture: undefined,
    aperture: undefined,
  })
  /*
  const [context, setContext] = useState({
    commons: {
      initialIsSidebarOpen: commonsSliceInitials.initialIsSidebarOpen,
      isSidebarOpen: commonsSliceInitials.isSidebarOpen,
    }
  })

  useEffect(() => {
    store.monitor(
      (state) => ({
        isSidebarOpen: state.commons.isSidebarOpen,
        initialIsSidebarOpen: state.commons.initialIsSidebarOpen
      }), 
      (state) => {
        setContext({
          commons:  {
            isSidebarOpen: state.commons.isSidebarOpen,
            initialIsSidebarOpen: state.commons.initialIsSidebarOpen,
          }
        })
      }
    )
  }, [])
  */

  /******************************************************************************
  * Aperture sidebar context/localStorage setters
  ******************************************************************************/

  const onApertureChange = useCallback((aperture: string) => {
    setState((prev) => ({
      ...prev,
      aperture
    }))
  }, [])

  useEffect(() => {
    window.electronAPI.store
      .get({ key: 'sidebarAperture' })
      .then((aperture) => {
        setState((prev) => ({
          ...prev,
          sidebarInitialAperture: aperture
        }))
      })
  }, [])

  useEffect(() => {
    // Store in local storage if changes
    if (state.aperture !== undefined) {
      window.electronAPI.store.set({ key: 'sidebarAperture', value: state.aperture })
    }
  }, [state.aperture])

  /******************************************************************************
  * IsOpen sidebar context/localStorage setters
  ******************************************************************************/

  const onIsSidebarOpenChange = useCallback((isSidebarOpen: boolean) => {
    const { setIsSidebarOpen } = commonsSlice.actions
    store.dispatch(setIsSidebarOpen({ value: isSidebarOpen }))
  }, [])

  useEffect(() => {
    store.dispatch(fetchInitialIsSidebarOpen())
  }, [])

  useEffect(() => {
    // Store in local storage if changes
    if (context.commons.isSidebarOpen !== undefined) {
      window.electronAPI.store.set({ key: 'isSidebarOpen', value: context.commons.isSidebarOpen })
    }
  }, [context.commons.isSidebarOpen])

  /******************************************************************************
  * Render return
  ******************************************************************************/

  return (
    <Box
      {...boxProps}
      className={css`
        background-color: var(--accent-a2);
        z-index: 9;
      `}
      minHeight='0px'
      asChild={true}
    >
      <ResizableSide
        direction='right'
        minSize='72px'
        maxSize='520px'
        offsetpad='120px'
        initialIsOpen={
          globals.ENVIRONMENT === 'testing' ||
          context.commons.initialIsSidebarOpen
        }
        isOpen={
          globals.ENVIRONMENT === 'testing' ||
          context.commons.isSidebarOpen
        }
        onIsOpenChange={(isOpen) => onIsSidebarOpenChange(isOpen)}
        initialAperture={state.sidebarInitialAperture}
        aperture={state.aperture}
        onApertureChange={onApertureChange}
        separator={
          <div 
            className={css`
              height: 100%;
              border-left: 1px solid var(--accent-a3);

              :hover {
                border-left: 3px solid var(--accent-a3);
              }
            `}
          />
        }
      >
        <Box
          width='100%'
          height='100%'
          overflow='clip'
          asChild={true}
        >
          <SidebarContent />
        </Box>
      </ResizableSide>
    </Box>
  )
}

export default Sidebar