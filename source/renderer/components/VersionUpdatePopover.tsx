import { Box, Button, Card, Flex, Heading, IconButton, Popover, Progress, ScrollArea, Text } from '@radix-ui/themes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate, faCircle, faCircleUp } from '@fortawesome/free-solid-svg-icons'
import { css } from '@emotion/css'
import {filesize} from "filesize"
import React, { forwardRef, ReactNode, useCallback, useState } from 'react'

import type { BoxProps, FlexProps, IconButtonProps } from '@radix-ui/themes'
import { useAppUpdater, AppUpdaterContext } from '@renderer/providers/AppUpdaterProvider'
import { UpdateInfo } from 'electron-updater'
import { useStore } from '@renderer/utils/redux-store'


const COLORS = {
  'light': {
    'active': 'var(--accent-9)',
    'passive': 'var(--gray-1)'
  },
  'dark': {
    'active': 'var(--accent-9)',
    'passive': 'var(--gray-9)'
  }
}

const ICON_STYLE = css`
  color: ${COLORS.light.active};

  @media (prefers-color-scheme: dark) {
    color: ${COLORS.dark.active};
  }
`

export default function VersionUpdatePopover (
  {
    ...aditionalProps
  }: FlexProps & {

  }
) {
  const updater = useAppUpdater()

  if (
    [
      'idle', 
      'error',
      'update-not-available', 
      'cancelled'
    ].includes(updater.status)
  ) {
    return <></>
  }

  return (
    <Popover.Root
      data-testid='version-update-popover-root'
    >
      <Popover.Trigger>
        <Flex
          {...aditionalProps}
          justify='center'
          align='center'
          p='2'
        >
          <VersionUpdateTriggerButton updater={updater} />
        </Flex>
      </Popover.Trigger>
      <Popover.Content
        data-testid='version-update-popup-content-container'
      >
        {{
          "checking-for-updates": <VersionUpdateCheckingForUpdates updater={updater} />, 
          "update-available": <VersionUpdateUpdateAvailable updater={updater} />,
          "dowloading-update": <VersionUpdateDownloading updater={updater} />,
          "update-downloaded": <VersionUpdateQuitAndInstall updater={updater} />,
          "notifying-update-available": <VersionUpdateNotify updater={updater} />,
          "idle": undefined,
          "cancelled": undefined, 
          "error": undefined,
          "update-not-available": undefined, 
        }[updater.status]}
      </Popover.Content>
    </Popover.Root>
  )
}

const VersionUpdateTriggerButton = forwardRef(function (
  {
    updater,
    ...iconButtonProps
  }: {
    updater: AppUpdaterContext
  } & IconButtonProps,
  ref: React.LegacyRef<any>,
)  {
  const context = useStore((state) => ({
    commons: { theme: state.commons.theme }
  }))
  const { status } = updater

  const activeColor = context.commons.theme === 'light' ? 
    COLORS.light.active : COLORS.dark.active
  const pasiveColor = context.commons.theme === 'light' ? 
    COLORS.light.passive : COLORS.dark.passive

  return (
    <IconButton
      {...iconButtonProps}
      ref={ref}
      className={css`
        position: relative;

        @media (prefers-color-scheme: light) {
          background-color: var(--gray-12);
        }
      `}
      size='2'
      variant='ghost'
    >
      <FontAwesomeIcon
        className={css`
            font-size: 1.0em;
            color: ${
              [
                "update-available", 
                "dowloading-update", 
                "update-downloaded", 
                "notifying-update-available",
              ].includes(status) ?
                activeColor : pasiveColor
            } ;
          ` + ' ' + 
          (["checking-for-updates", "dowloading-update"].includes(status) ? 
              'fa-spin' : '')
        }
        icon={faRotate}
      />

      <FontAwesomeIcon
        className={css`
          display: ${
            [
              "update-available",
              "notifying-update-available",
            ].includes(status) ? 'block' : 'none'
          };
          color: ${activeColor};
          position: absolute;
          font-size: 0.45em;
          top: 20%;
          right: 20%;
        `}
        icon={faCircle}
      />

      <FontAwesomeIcon
        className={css`
          display: ${
            ["update-downloaded"].includes(status) ?
              'block' : 'none'
          };
          color: ${activeColor};
          font-size: 0.65em;
          position: absolute;
          top: 4px;
          right: 4px;
        `}
        icon={faCircleUp}
      />
    </IconButton>
  )
})

function VersionUpdateUpdateAvailable (
  {
    updater,
    ...flexProps
  }: FlexProps & {
    updater: AppUpdaterContext
  }
) {
  const { info, cancelUpdate, downloadUpdate } = updater
  const { version, releaseNotes, files } = info ? 
    info : { version: '', releaseNotes: '', files: []} as unknown as UpdateInfo

  // If there are files in info files sum them if not return 0
  const filesSize = files ?
    (files.reduce((acc, file) => {
      return acc + file.size
    }, 0)) / files.length : 0
  return (
    <Flex
      {...flexProps}
      direction='column'
      justify='start'
      align='stretch'
      gap='4'
      width='320px'
      height='220px'
    >
      <Flex
        data-tesid='update-version-popover-header'
        direction='row'
        justify='start'
        align='start'
        gap='4'

      >
        <FontAwesomeIcon
          className={ICON_STYLE}
          size='xl'
          icon={faCircleUp}
        />
        <Heading
          size='1'
        >
          There is a new version of Amberpad, do you want to install it?
        </Heading>
      </Flex>

      <Box
        data-tesid='update-version-popover-content'
        p='3'
        flexBasis='1'
        flexShrink='1'
        asChild={true}
      >
        <Card
          data-radius='none'
          className={css`
            width: 100%
            height: 100%;

            @media (prefers-color-scheme: dark) {
              background-color: var(--gray-6);
            }
          `}
          asChild={true}
        >
          <ScrollArea
            scrollbars='vertical'
            type='auto'
            size='1'
            m='0'
          >
            <Text
              size='1'
            >
              <Heading
                size='1'
              >
                Amberpad&nbsp;
                { version }&nbsp;
                { filesSize ? `(~${filesize(filesSize, {standard: "jedec"})})` : '' }
              </Heading>
              {((): ReactNode => { 
                if (typeof releaseNotes === 'string') {
                  return <p dangerouslySetInnerHTML={{__html: releaseNotes}} />
                } else if (Array.isArray(releaseNotes)) {
                  return (
                    <ul>
                      {
                        releaseNotes.map((item, index) => 
                          <li key={index}><p dangerouslySetInnerHTML={{__html: item.note}} /></li>)
                      }
                    </ul>
                  )
                } else {
                  return ''
                }
              })()}
              </Text>
            </ScrollArea>
          </Card>
      </Box>

      <Flex
        data-tesid='update-version-popover-options'
        direction='row'
        justify='end'
        align='center'
        gap='4'
      >
        <Button
          variant='ghost'
          color='gray'
          onClick={() => cancelUpdate()}
        >
          <Text size='1'>Maybe later</Text>
        </Button>
        <Button
          variant='ghost'
          onClick={() => downloadUpdate()}
        >
          <Text size='1'>Download</Text>
        </Button>
      </Flex>
    </Flex>
  )
}

function VersionUpdateCancelDownload (
  {
    onReject=undefined,
    onConfirm=undefined,
    ...flexProps
  }: FlexProps & {
    onReject?: () => void,
    onConfirm?: () => void
  }
) {

  return (
    <Flex
      {...flexProps}
      direction='column'
      justify='start'
      align='stretch'
      gap='4'
      width='320px'
      maxHeight='220px'
    >
      <Flex
        data-tesid='update-version-popover-header'
        direction='row'
        justify='start'
        align='start'
        gap='4'
      >
        <FontAwesomeIcon
          className={ICON_STYLE}
          size='xl'
          icon={faCircleUp}
        />
        <Heading
          size='1'
        >
          Are you sure you want to cancel the download?
        </Heading>
      </Flex>

      <Flex
        data-tesid='update-version-popover-options'
        direction='row'
        justify='end'
        align='center'
        gap='4'
      >
        <Button
          variant='ghost'
          color='gray'
          onClick={() => onReject && onReject()}
        >
          <Text size='1'>Keep downloading</Text>
        </Button>
        <Button
          variant='ghost'
          onClick={() => onConfirm && onConfirm()}
        >
          <Text size='1'>Cancel</Text>
        </Button>
      </Flex>
    </Flex>
  )
}

function VersionUpdateDownloading (
  {
    updater,
    ...flexProps
  }: FlexProps & {
    updater: AppUpdaterContext,
  }
) {
  const { info, progress, cancelUpdate }  = updater;
  const [isCanceling, setIsCanceling] = useState(false)

  const onCancel = useCallback(() => {
    setIsCanceling(true)
  }, [])

  if (isCanceling) {
    return (
      <VersionUpdateCancelDownload 
        onConfirm={() => {
          setIsCanceling(false)
          cancelUpdate()
        }}
        onReject={() => {
          setIsCanceling(false)
        }}
      />
    )
  }

  const filesSize = info.files ?
    (info.files.reduce((acc, file) => {
      return acc + file.size
    }, 0)) / info.files.length : 0
  return (
    <Flex
      {...flexProps}
      direction='column'
      justify='start'
      align='stretch'
      gap='4'
      width='320px'
      maxHeight='220px'
    >
      <Flex
        data-tesid='update-version-popover-header'
        direction='row'
        justify='start'
        align='start'
        gap='4'
      >
        <FontAwesomeIcon
          className={ICON_STYLE}
          size='xl'
          icon={faCircleUp}
        />
        <Heading
          size='1'
        >
        Amberpad&nbsp;
        { info.version }&nbsp;
        { filesSize ? `(~${filesize(filesSize, {standard: "jedec"})})` : '' }
        </Heading>
      </Flex>

      <Flex
        data-tesid='update-version-popover-content'
        p='2'
        direction='column'
        justify='center'
        align='stretch'
      >
        <Box maxWidth="360px">
          <Progress 
            value={progress ? progress.percent : 0}
            size='3'
          />
        </Box>
      </Flex>

      <Flex
        data-tesid='update-version-popover-options'
        direction='row'
        justify='end'
        align='center'
        gap='4'
      >
        <Button
          variant='ghost'
          onClick={() => onCancel && onCancel()}
        >
          <Text size='1'>Cancel</Text>
        </Button>
      </Flex>
    </Flex>
  )
}

function VersionUpdateQuitAndInstall (
  {
    updater,
    ...flexProps
  }: FlexProps & {
    updater: AppUpdaterContext
  }
) {
  const { info, quitAndInstall }  = updater;

  // If there are files in info files sum them if not return 0
  const filesSize = info.files ?
    (info.files.reduce((acc, file) => {
      return acc + file.size
    }, 0)) / info.files.length : 0
  return (
    <Flex
      {...flexProps}
      direction='column'
      justify='start'
      align='stretch'
      gap='4'
      width='320px'
      maxHeight='220px'
    >
      <Flex
        data-tesid='update-version-popover-header'
        direction='row'
        justify='start'
        align='start'
        gap='4'
      >
        <FontAwesomeIcon
          className={ICON_STYLE}
          size='xl'
          icon={faCircleUp}
        />
        <Heading
          size='1'
        >
          Amberpad&nbsp;
          { info.version }&nbsp;
          { filesSize ? `(~${filesize(filesSize, {standard: "jedec"})})` : '' } ready to install, do you want to close the application and install?
        </Heading>
      </Flex>

      <Flex
        data-tesid='update-version-popover-options'
        direction='row'
        justify='end'
        align='center'
        gap='4'
      >
        <Button
          variant='ghost'
          onClick={() => quitAndInstall()}
        >
          <Text size='1'>Quit and install</Text>
        </Button>
      </Flex>
    </Flex>
  )
}

function VersionUpdateCheckingForUpdates (
  {
    updater,
    ...flexProps
  }: FlexProps & {
    updater: AppUpdaterContext
  }
) {

  return (
    <Flex
      {...flexProps}
      direction='column'
      justify='start'
      align='stretch'
      gap='2'
      width='320px'
      maxHeight='220px'
    >
      <Flex
        data-tesid='update-version-popover-header'
        direction='row'
        justify='start'
        align='center'
        gap='2'
      >
        <FontAwesomeIcon
          className={ICON_STYLE}
          size='1x'
          icon={faCircleUp}
        />
        <Heading
          size='1'
        >
          Checking if there are updates available...
        </Heading>
      </Flex>
    </Flex>
  )
}

function VersionUpdateNotify (
  {
    updater,
    ...flexProps
  }: FlexProps & {
    updater: AppUpdaterContext,
  }
) {
  const { info, progress, dismiss }  = updater;

  return (
    <Flex
    {...flexProps}
      direction='column'
      justify='start'
      align='stretch'
      gap='2'
      width='320px'
      maxHeight='220px'
    >
      <Flex
        data-tesid='update-version-popover-header'
        direction='row'
        justify='start'
        align='center'
        gap='4'
      >
        <FontAwesomeIcon
          className={ICON_STYLE}
          size='2x'
          icon={faCircleUp}
        />
        <Heading
          size='1'
        >
          A new version of Amberpad { info ? `(v${info.version})` : ''} is now available. 
          Visit the app's website and download it to ensure you don't miss out on any new features.
        </Heading>
      </Flex>

      <Flex
        data-tesid='update-version-popover-options'
        direction='row'
        justify='end'
        align='center'
        gap='4'
      >
        <Button
          variant='ghost'
          onClick={() => dismiss()}
        >
          <Text size='1'>Dismiss</Text>
        </Button>
      </Flex>
    </Flex>
  )
}