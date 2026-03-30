import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../../../../index'

const fields = [
  {
    label: 'Date',
    type: 'date-picker',
    name: 'date',
    labelVisuallyHidden: true,
  },
  {
    label: 'Operator',
    type: 'select',
    name: 'select',
    choices: {
      test1: 'Test1',
      test2: 'Test2',
      test3: 'Test3',
      test4: 'Test4',
    },
    labelVisuallyHidden: true,
  },
  {
    label: 'Color',
    type: 'color-picker',
    name: 'color',
    labelVisuallyHidden: true,
  },
]

const meta = {
  title: 'Repeater (Legacy)/Bare',
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
    layout: 'bare',
    fields: fields,
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

/**
 * Limit the number of rows to 2
 */
export const MaxRows: Story = {
  args: {
    maxlength: 2,
  }
}

/**
 * Non-repeatable: only one row, no add/delete buttons
 */
export const NonRepeatable: Story = {
  args: {
    repeatable: false,
  }
}

/**
 * Inject custom content before and after each row's fields
 */
export const BeforeAndAfterRow: Story = {
  args: {
    beforeRow: (item, i) => (
      <p>Before row {i + 1}</p>
    ),
    afterRow: (item, i) => (
      <p>After row {i + 1}</p>
    ),
  }
}
