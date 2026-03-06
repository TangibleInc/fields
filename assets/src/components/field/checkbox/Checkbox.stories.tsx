import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import Checkbox from './Checkbox'

const meta = {
  title: 'Field/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    isDisabled: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    labelVisuallyHidden: { control: 'boolean' },
  },
  args: {
    label: 'Accept terms and conditions',
  }
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithDescription: Story = {
  args: {
    label: 'Subscribe to newsletter',
    description: 'We send updates monthly. You can unsubscribe at any time.',
  }
}

export const Checked: Story = {
  args: {
    label: 'Pre-checked option',
    value: true,
  }
}

export const Disabled: Story = {
  args: {
    label: 'Disabled checkbox',
    isDisabled: true,
  }
}

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled and checked',
    value: true,
    isDisabled: true,
  }
}

export const Required: Story = {
  args: {
    label: 'Required field',
    isRequired: true,
  }
}

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <Checkbox
          label="Toggle me"
          value={checked}
          onChange={setChecked}
        />
        <p style={{ fontSize: '0.875rem', color: '#666' }}>
          Value: {String(checked)}
        </p>
      </div>
    )
  }
}
