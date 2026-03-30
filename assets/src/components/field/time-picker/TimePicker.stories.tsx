import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../../../index'

const meta = {
  title: 'Fields (Legacy)/TimePicker',
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
    type: 'time-picker',
    label: 'Time field',
    description: 'Description',
    hourCycle: 12,
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithLimits: Story = {
  args: {
    minValue: '09:00',
    maxValue: '17:00',
    description: 'You can only select a time between 9 AM to 5:00 PM',
  }
}
