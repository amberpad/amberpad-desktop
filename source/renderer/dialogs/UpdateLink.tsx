import React, { useState } from 'react'
import { 
  Dialog, 
  Flex, 
  Button,
  TextField, 
  Text
} from '@radix-ui/themes'

function UpdateLinkContent(
  {
    onSuccess=undefined,
    initial={},
    ...dialogContentprops
  }: Parameters<typeof Dialog.Content>[0] & {
    onSuccess?: (URL: string) => void,
    initial?: {[key: string]: any}
  }
) {
  const [state, setState] = useState({
    link: initial.link || '',
  })

  const clearForm = () => {
    setState({
      link: '',
    })
  }

  const _onCancel = () => {
    clearForm()
  }

  const _onSuccess = () => {
    // Resolve
    onSuccess(state.link)
    clearForm()
  }

  return (
    <Dialog.Content
      aria-describedby={undefined}
      {...dialogContentprops}
    >
      <Dialog.Title size='2'>
        Update link
      </Dialog.Title>

      <Flex 
        direction='column'
        gap='3'
      >
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            URL
          </Text>
          <TextField.Root 
            size='2'
            value={state.link}
            onChange={(event) => setState({ link: event.target.value })}
          />
        </label>
      </Flex>

      <Flex gap="3" mt="4" justify="end">
        <Dialog.Close>
          <Button
            variant="soft"
            color="gray"
            onClick={_onCancel}
          >
            Cancel
          </Button>
        </Dialog.Close>
        <Dialog.Close>
          <Button
            disabled={state.link === ''}
            onClick={_onSuccess}
          >
            Save
          </Button>
        </Dialog.Close>
      </Flex>
    </Dialog.Content>
  )
}

export default {
  ...Dialog,
  Content: UpdateLinkContent,
}