import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../../../index'

const meta = {
  title: 'Fields (Legacy)/Color',
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
    type: 'color-picker',
    label: 'Color',
    placeholder: 'Example placeholder',
    description: 'Example description',
    hasAlpha: true,
    format: 'rgba',
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutOpacity: Story = {
  args: {
    hasAlpha: false,
    format: 'hex',
  }
}

export const RGB: Story = {
  args: {
    format: 'rgb',
    hasAlpha: false,
  }
}

export const HSL: Story = {
  args: {
    format: 'hsl',
    hasAlpha: false,
  }
}
