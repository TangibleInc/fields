import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../../../index'

const meta = {
  title: 'Fields (Legacy)/SimpleDimension',
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
    type: 'simple-dimension',
    label: 'Simple Dimension field',
    description: 'Description',
    units: ['px', 'vh', '%', 'vw'],
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SingleUnit: Story = {
  args: {
    units: ['px'],
  }
}
