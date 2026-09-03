import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import ConfirmDialog, { ConfirmTrigger } from './ConfirmDialog'
import Button from '../button/Button'

const meta = {
  title: 'Base/ConfirmDialog',
  component: ConfirmTrigger,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    confirmType: {
      control: 'select',
      options: ['danger', 'primary']
    }
  }
} satisfies Meta<typeof ConfirmTrigger>

export default meta
type Story = StoryObj<typeof meta>

export const Destructive: Story = {
  args: {
    label: 'Remove',
    title: 'Remove item 2?',
    children: 'This cannot be undone.',
    onConfirm: () => console.log('confirmed')
  }
}

export const RemoveAll: Story = {
  args: {
    label: 'Remove all',
    title: 'Remove all items?',
    children: 'Every item in this list will be removed.',
    onConfirm: () => console.log('confirmed')
  }
}

export const NonDestructive: Story = {
  args: {
    label: 'Publish',
    title: 'Publish these changes?',
    children: 'The changes go live immediately.',
    confirmType: 'primary',
    buttonProps: { type: 'primary' },
    onConfirm: () => console.log('confirmed')
  }
}

export const IconTrigger: Story = {
  args: {
    label: 'Remove',
    title: 'Remove item?',
    buttonProps: { type: 'icon-trash', contentVisuallyHidden: true },
    onConfirm: () => console.log('confirmed')
  }
}

export const TitleOnly: Story = {
  args: {
    label: 'Discard',
    title: 'Discard unsaved changes?',
    onConfirm: () => console.log('confirmed')
  }
}

/**
 * The controlled component on its own, for when the trigger is not a button
 * (or the confirm is fired from elsewhere in the flow).
 */
export const Controlled: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [log, setLog] = useState('')
    return (
      <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
        <Button type="action" onPress={() => setOpen(true)}>Open dialog</Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Remove item?"
          confirmText="Remove"
          onConfirm={() => setLog('Confirmed')}
          onCancel={() => setLog('Cancelled')}
        >
          Are you sure you want to remove this item?
        </ConfirmDialog>
        <output>{log}</output>
      </div>
    )
  }
}
