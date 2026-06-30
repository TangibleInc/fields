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
  title: 'Repeater (Legacy)/Tab',
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
    layout: 'tab',
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
 * Section title using a dependent attribute — displays the text field value as tab name
 */
export const DependentTitle: Story = {
  args: {
    sectionTitle: '{{text_name}}',
  }
}

/**
 * Section title with a dependent callback to format the value
 */
export const DependentTitleWithCallback: Story = {
  args: {
    sectionTitle: '{{text_name}}',
    dependent: {
      callback: ({ value }) => value
        ? `Tab: ${value.toUpperCase()}`
        : <span style={{ opacity: 0.5 }}>Unnamed</span>,
    },
  }
}