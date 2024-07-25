import React, { useEffect, useState } from 'react'
import { Box, Flex, ScrollArea, } from '@radix-ui/themes'
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

  const paginateOverScrolledOver = (elements: any[]) => {
    const forPagination = elements
    store.dispatch(fetchPagesThunk({
      notepads: forPagination,
      search: '',
    }))
  }

  // If context isOpen is undefined fallback to intial value
  const isOpen =  context.commons.isSidebarOpen === undefined ?
    context.commons.initialIsSidebarOpen :
    context.commons.isSidebarOpen
  return (
    <Box
      { ...props }
      className={`${props.className || ''}`}
    >
      <Flex
        height='100%'
        direction='column'
        gap='0'
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
            hasMore={context.notepads.hasNextPage}
            next={onScrollNext}
            loading={context.notepads.loading}
            adjustScrollHash={`${context.notepads.adjustScrollHash}`}
            scrollEndHash={`${context.notepads.scrollEndHash}`}
            scrolledOver={paginateOverScrolledOver}
            scrolledOverToID={(item) => parseInt(item.id)}
            scrolledOverHashMap={
              _.mapValues(
                context.notepads.paginationMap, 
                (object: any) => object.hash
              )
            }
          >
            {
              context.notepads.values.map((item: any, key: number) => (
                <Notepad 
                  key={key}
                  data={item}
                  loading={context.notepads.paginationMap[item.id].isLoading}
                />
              ))
            }
          </InifiniteScroll>
        </Flex>
      </Flex>
    </Box>
  )
}

export default SidebarContent