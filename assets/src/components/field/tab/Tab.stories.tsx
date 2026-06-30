import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../../../index'

const meta = {
  title: 'Fields (Legacy)/Tab',
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
    type: 'tab',
    label: 'Tab field',
    tabs: {
      'tab-name-1': {
        title: 'Tab name 1',
        fields: [
          { label: 'Text field', type: 'text', name: 'text-field' },
          { label: 'Number field', type: 'number', name: 'number-field' },
        ]
      },
      'tab-name-2': {
        title: 'Tab name 2',
        fields: [
          { label: 'Color field', type: 'color-picker', name: 'color-field' },
          { label: 'Number field', type: 'number', name: 'number-field-2' },
        ]
      }
    }
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
