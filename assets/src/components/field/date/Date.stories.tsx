import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../../../index'

const meta = {
  title: 'Fields (Legacy)/DatePicker',
  component: Field,
  decorators: [
    Story => (
      <div style={{ minWidth: '500px' }}>
        <Story />
      </div>
    )
  ],
  parameters: {
    layout: 'padded'
  },
  args: {
    type: 'date-picker',
    label: 'Date field',
    description: 'Description',
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FutureOnly: Story = {
  args: {
    futureOnly: true,
  }
}

export const DateRange: Story = {
  args: {
    dateRange: true,
  }
}

export const MultiMonth: Story = {
  args: {
    dateRange: true,
    multiMonth: 3,
  }
}

export const WithPresets: Story = {
  args: {
    dateRange: true,
    multiMonth: 2,
    datePresets: true,
  }
}
