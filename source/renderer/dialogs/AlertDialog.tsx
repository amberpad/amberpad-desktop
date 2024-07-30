import React, { ReactNode, useState } from "react";
import { Button, Dialog, Flex } from "@radix-ui/themes";

export type AlertDialogProps = Parameters<typeof AlertDialog>[0]

export default function AlertDialog (
  {
    children=undefined,
    content=undefined,
    title=undefined,
    description=undefined,
    cancel=undefined,
    success=undefined,
    onCancel=undefined,
    onSuccess=undefined,
    onKeyDown=undefined,
    ...alertDialogProps
  }: {
    children?: ReactNode,
    content?: ReactNode,
    title?: ReactNode,
    description?: ReactNode,
    cancel?: ReactNode,
    success?: ReactNode,
    onCancel?: () => void,
    onSuccess?: () => void,
    onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>,
  } & Dialog.RootProps
) {
  return (
    <Dialog.Root
      {...alertDialogProps}
    >
      {
        children && (
          <Dialog.Trigger>
            {children}
          </Dialog.Trigger>
        )
      }
      <Dialog.Content
        maxWidth='520px'
        onKeyDown={onKeyDown}
      >
        <Dialog.Title>
          {title}
        </Dialog.Title>

        <Dialog.Description 
          aria-describedby={undefined}
          size="2"
        >
          {description}  
        </Dialog.Description>
        
        {content}

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close
            data-testid='modal-cancel-button'
            onClick={onCancel}
          >
            {
              cancel ? 
                cancel : 
                (
                  <Button
                    variant="soft"
                    color="gray"
                  >
                    Cancel
                  </Button>
                )
            }
          </Dialog.Close>
          <Dialog.Close
            data-testid='modal-confirm-button' 
            onClick={onSuccess}
          >
            {
              success ? 
                success : 
                (
                  <Button>
                    Confirm
                  </Button>
                )
            }
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}