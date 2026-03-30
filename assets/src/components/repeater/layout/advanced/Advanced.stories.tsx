import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../../../../index'

const fields = [
  {
    label: 'Date',
    type: 'date-picker',
    name: 'date',
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
  },
  {
    label: 'Color',
    type: 'color-picker',
    name: 'color',
  },
]

const meta = {
  title: 'Repeater (Legacy)/Advanced',
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
    layout: 'advanced',
    fields: fields,
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

/**
 * Only show "date" in the overview row (hides "select" and "color")
 */
export const HeaderConfigSubset: Story = {
  args: {
    headerFields: ['date'],
  }
}

/**
 * Format the value displayed in the overview row with a callback
 */
export const HeaderConfigWithCallback: Story = {
  args: {
    headerFields: [
      'date',
      { name: 'color', callback: ({ value }) => <span style={{ color: value }}>{value}</span> },
    ],
  }
}

/**
 * Limit the number of rows to 3
 */
export const MaxRows: Story = {
  args: {
    maxlength: 3,
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
      <p>This content is injected before row {i + 1} fields</p>
    ),
    afterRow: (item, i) => (
      <p>This content is injected after row {i + 1} fields</p>
    ),
  }
}

export const WithBulk: Story = {
  args: {
    useBulk: true,
  }
}
