import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../../../index'

const meta = {
  title: 'Fields (Legacy)/Border',
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
    type: 'border',
    label: 'Border field',
    description: 'Description',
    enableOpacity: true,
    format: 'rgba',
    units: ['px', 'vh', '%', 'vw'],
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutOpacity: Story = {
  args: {
    enableOpacity: false,
  }
}

export const ForcedUnlinked: Story = {
  args: {
    linked: false,
  }
}

export const ForcedLinked: Story = {
  args: {
    linked: true,
    format: 'hex',
  }
}

export const SingleUnit: Story = {
  args: {
    units: ['px'],
  }
}
