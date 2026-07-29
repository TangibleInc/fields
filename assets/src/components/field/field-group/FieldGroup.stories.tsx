import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../../../index'

const fields = [
  {
    label: 'Text',
    type: 'text',
    name: 'text_name',
  },
  {
    label: 'Dimensions',
    type: 'dimensions',
    name: 'dimension_name',
  }
]

const meta = {
  title: 'Fields (Legacy)/Field Group',
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
    type: 'field-group',
    name: 'field-group',
    fields: fields,
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

/**
 * The value of every subfield is saved in a single JSON object, keyed by the
 * subfield name
 */
export const WithValue: Story = {
  args: {
    value: JSON.stringify({
      text_name: 'Example value',
      dimension_name: {
        top: 10,
        left: 20,
        right: 20,
        bottom: 10,
        unit: 'px',
        isLinked: false,
      },
    }),
  }
}

/**
 * Elements can be used alongside fields, they have no value
 */
export const WithElement: Story = {
  args: {
    fields: [
      fields[0],
      {
        type: 'title',
        name: 'group_title',
        level: 4,
        content: 'A title element between two fields',
      },
      fields[1],
    ],
  }
}

/**
 * When uncontrolled, each subfield keeps its own name and value, the group
 * itself has no value and outputs no hidden input
 */
export const Uncontrolled: Story = {
  args: {
    uncontrolled: true,
  }
}
