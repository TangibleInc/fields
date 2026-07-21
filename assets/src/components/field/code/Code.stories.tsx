import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../../../index'

const meta = {
  title: 'Fields (Legacy)/Code',
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
    type: 'code',
    label: 'Code',
    description: 'Example description',
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
