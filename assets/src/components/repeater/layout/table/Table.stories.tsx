import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../../../../index'

const fields = [
  {
    label: 'Text',
    type: 'text',
    name: 'text_name',
  },
  {
    label: 'Date field',
    type: 'date-picker',
    name: 'date_picker_name',
  },
  {
    label: 'Color',
    type: 'color-picker',
    name: 'color',
  },
]

const meta = {
  title: 'Repeater (Legacy)/Table',
  component: Field,
  decorators: [
    Story => (
      <div style={{ minWidth: '600px' }}>
        <Story />
      </div>
    )
  ],
  parameters: {
    layout: 'padded'
  },
  args: {
    type: 'repeater',
    label: 'Repeater field',
    layout: 'table',
    fields: fields,
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NonRepeatable: Story = {
  args: {
    repeatable: false,
  }
}

export const MaxRows: Story = {
  args: {
    maxlength: 3,
  }
}

/**
 * With bulk actions for batch operations on rows
 */
export const BulkActions: Story = {
  args: {
    useBulk: true,
  }
}
