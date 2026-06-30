import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../../../index'

const accordionFields = [
  { type: 'text', label: 'Name', name: 'name' },
  { type: 'text', label: 'Description', name: 'description' },
]

const meta = {
  title: 'Fields (Legacy)/Accordion',
  component: Field,
  decorators: [
    Story => (
      <div style={{ minWidth: '500px' }}>
        <Story />
      </div>
    )
  ],
  parameters: {
    layout: 'centered'
  },
  args: {
    type: 'accordion',
    title: 'Section title',
    fields: accordionFields,
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Open: Story = {
  args: {
    isOpen: true,
  }
}

export const WithSwitch: Story = {
  args: {
    useSwitch: true,
    isOpen: true,
  }
}