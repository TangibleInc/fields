import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../../../index'

const meta = {
  title: 'Fields (Legacy)/Dimensions',
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
    type: 'dimensions',
    label: 'Dimensions field',
    description: 'Description',
    units: ['px', 'vh', '%', 'vw'],
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ForcedUnlinked: Story = {
  args: {
    linked: false,
  }
}

export const ForcedLinked: Story = {
  args: {
    linked: true,
    units: ['px', 'vw'],
  }
}

export const SingleUnit: Story = {
  args: {
    units: ['px'],
  }
}
