import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../../../index'

const meta = {
  title: 'Fields (Legacy)/List',
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
    type: 'list',
    label: 'List field',
    placeholder: 'Example placeholder',
    description: 'Example description',
    choices: {
      test1: 'Test 1',
      test2: 'Test 2',
      test3: 'Test 3',
    },
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithVisibility: Story = {
  args: {
    useVisibility: true,
  }
}
