import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../../../index'

const meta = {
  title: 'Fields (Legacy)/Editor',
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
    type: 'wysiwyg',
    label: 'Editor',
    placeholder: 'Example placeholder',
    description: 'Example description',
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutRawView: Story = {
  args: {
    rawView: false,
  }
}
