import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import TextArea from './TextArea'

const meta = {
  title: 'Field/Textarea',
  component: TextArea,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    placeholder: { control: 'text' },
    readOnly: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    rows: { control: 'number' },
  },
  args: {
    label: 'Description',
    placeholder: 'Enter a description...',
  }
} satisfies Meta<typeof TextArea>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    description: 'Supports multi-line text input.',
  }
}

export const WithValue: Story = {
  args: {
    label: 'Bio',
    value: 'A short biography that spans multiple lines to demonstrate the textarea component in its natural state.',
    rows: 4,
  }
}

export const ReadOnly: Story = {
  args: {
    label: 'Read-only content',
    value: 'This content cannot be edited.',
    readOnly: true,
  }
}

export const Disabled: Story = {
  args: {
    label: 'Disabled textarea',
    value: 'Disabled content',
    isDisabled: true,
  }
}

export const WithError: Story = {
  args: {
    label: 'Required field',
    isRequired: true,
    isInvalid: true,
    description: 'This field is required.',
  }
}

export const CustomRows: Story = {
  args: {
    label: 'Tall textarea',
    rows: 8,
    placeholder: 'Plenty of room to write...',
  }
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div style={{ display: 'grid', gap: '0.5rem', minWidth: '360px' }}>
        <TextArea
          label="Notes"
          description="Write whatever you like."
          value={value}
          onChange={setValue}
          placeholder="Start typing..."
        />
        <p style={{ fontSize: '0.875rem', color: '#666' }}>
          Characters: {value.length}
        </p>
      </div>
    )
  }
}
