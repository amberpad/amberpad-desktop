import React, { useEffect, useState } from 'react'
import { Box, Flex } from '@radix-ui/themes'
import _ from 'lodash'
import { css } from '@emotion/css'

import store from '@renderer/utils/redux-store'
import { commonsSliceInitials } from '@renderer/actions/commons.slice'
import { fetchNotepadsThunk, fetchPagesThunk } from '@renderer/actions/notepads.slice'
import InifiniteScroll from '@renderer/wrappers/InifiniteScroll'
import SidebarHeader from '@renderer/sections/SidebarHeader'
import Notepad from '@renderer/components/Notepad'
import SelectedPage from '@renderer/components/SelectedPage'

import type { BoxProps } from '@radix-ui/themes'

function SidebarContent(props: BoxProps) {
  const [context, setContext] = useState({
    commons: {
      initialIsSidebarOpen: commonsSliceInitials.initialIsSidebarOpen,
      isSidebarOpen: commonsSliceInitials.isSidebarOpen,
      search: '',
    },
    pages: {
      selectedPageID: undefined,
    },
    notepads: {
      values: [],
      page: 1,
      hasNextPage: true,
      adjustScrollHash: 0,
      scrollEndHash: 0,
      loading: false,
      paginationMap: {} as {
        [key: number]: {
            page: number,
            hasNext: boolean;
            isLoading: boolean;
            hash: number;
        }
      }
    }
  })

  useEffect(() => {
    store.monitor(
      (state) => ({
        initialIsSidebarOpen: state.commons.initialIsSidebarOpen,
        isSidebarOpen: state.commons.isSidebarOpen,
        search: state.commons.search,
        selectedPageID: state.pages.selectedPageID
      }),
      (state) => setContext((prev) => ({
        ...prev,
        commons: {
          initialIsSidebarOpen: state.commons.initialIsSidebarOpen,
          isSidebarOpen: state.commons.isSidebarOpen,
          search: state.commons.search,
        },
        pages: {
          selectedPageID: state.pages.selectedPageID
        }
      }))
    )
  }, [])

  useEffect(() => {
    store.monitor(
      (state) => ({
        values: state.notepads.values,
        page: state.notepads.values,
        hasNextPage: state.notepads.hasNextPage,
        adjustScrollHash: state.notes.adjustScrollHash,
        scrollEndHash: state.notepads.scrollEndHash,
        paginationMap: state.notepads.paginationMap,
        loading: state.notepads.loading,
      }),
      (state) => setContext((prev) => ({
        ...prev,
        notepads: {
          ...state.notepads,
          values: state.notepads.values,
          page: state.notepads.page,
          hasNextPage: state.notepads.hasNextPage,
          adjustScrollHash: state.notepads.adjustScrollHash,
          scrollEndHash: state.notepads.scrollEndHash,
          loading: state.notepads.loading,
          paginationMap: state.notepads.paginationMap,
        }
      }))
    )
  })

  const onScrollNext = () => {
    store.dispatch(fetchNotepadsThunk({
      page: context.notepads.page + 1,
      search: context.pages.selectedPageID === undefined ? context.commons.search  : ''
    }))   
  }

  const paginateOverScrolledOver = (values: any[]) => {
    store.dispatch(fetchPagesThunk({
      notepads: values,
      search: '',
    }))
  }

  let isOpen =  context.commons.isSidebarOpen === undefined ?
    context.commons.initialIsSidebarOpen :
    context.commons.isSidebarOpen
  if (globals.ENVIRONMENT === 'testing') {
    // on testing enviroment should always be open
    isOpen = true
  }

  return (
    <Box
      { ...props }
      className={`${props.className || ''}`}
    >
      <Flex
        height='100%'
        direction='column'
        gap='4'
        px='4'
        py='4'
        justify='start'
        align='stretch'
      >
        <SidebarHeader 
          maxWidth='100%'
          isSidebarOpen={isOpen}
        />
        <SelectedPage 
          isSidebarOpen={isOpen}
        />
        <Flex
          className={!isOpen && css`
            display: none;
          `}
          minHeight='0'
          flexGrow='1'
          pr='3'
          direction='column'
          gap='4'
          justify='start'
          align='stretch'
          overflowY='auto'
          overflowX='hidden'
          asChild={true}
        >
          <InifiniteScroll
            data-testid='notepad-pages-scrolling-area'
            data={context.notepads.values}
            renderItem={(item) => (
              <Notepad
                data={item}
                loading={context.notepads.paginationMap[item.id].isLoading}
              />
            )}
            getItemID={(item) => item.id}
            hasMore={context.notepads.hasNextPage}
            next={onScrollNext}
            loading={context.notepads.loading}
            adjustScrollHash={`${context.notepads.adjustScrollHash}`}
            scrollEndHash={`${context.notepads.scrollEndHash}`}
            scrolledOver={paginateOverScrolledOver}
            scrolledOverHashMap={
              _.mapValues(
                context.notepads.paginationMap, 
                (object: any) => object.hash
              )
            }
          />
        </Flex>
      </Flex>
    </Box>
  )
}

export default SidebarContent