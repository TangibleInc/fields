import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../../index'

const operators = {
  _eq: 'Is',
  _neq: 'Is not',
  _lt: 'Less than',
  _gt: 'Greater than',
}

const meta = {
  title: 'Fields (Legacy)/Conditional Panel',
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
    type: 'conditional-panel',
    dynamic_categories: ['post'],
    operators,
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithModal: Story = {
  args: {
    useModal: true,
  }
}
