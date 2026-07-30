import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import Switch from './Switch'

const meta = {
  title: 'Field/Switch',
  component: Switch,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    isDisabled: { control: 'boolean' },
  },
  args: {
    label: 'Enable notifications',
  }
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithDescription: Story = {
  args: {
    label: 'Dark mode',
    description: 'Switch between light and dark colour schemes.',
  }
}

export const On: Story = {
  args: {
    label: 'Already enabled',
    value: true,
  }
}

export const Disabled: Story = {
  args: {
    label: 'Disabled switch',
    isDisabled: true,
  }
}

export const DisabledOn: Story = {
  args: {
    label: 'Locked on',
    value: true,
    isDisabled: true,
  }
}

export const Controlled: Story = {
  render: () => {
    const [enabled, setEnabled] = useState(false)
    return (
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <Switch
          label="Toggle me"
          value={enabled}
          onChange={setEnabled}
        />
        <p style={{ fontSize: '0.875rem', color: '#666' }}>
          Value: {String(enabled)}
        </p>
      </div>
    )
  }
}
