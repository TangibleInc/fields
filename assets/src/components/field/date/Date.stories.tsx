import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../../../index'

const meta = {
  title: 'Fields (Legacy)/DatePicker',
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
    type: 'date-picker',
    label: 'Date field',
    description: 'Description',
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

/**
 * @see src/deprecated/fields/date
 */
const deprecatedNotice = Story => (
  <>
    <p
      style={{
        margin: '0 0 12px',
        padding: '8px 12px',
        borderLeft: '3px solid #d68000',
        background: '#fff8ec',
        color: '#4a3208',
        fontSize: '13px',
        lineHeight: 1.5
      }}
    >
      The date range still relies on the deprecated date picker, it needs to be migrated.
    </p>
    <Story />
  </>
)

export const Default: Story = {}

export const FutureOnly: Story = {
  args: {
    futureOnly: true,
  }
}

export const DateRange: Story = {
  decorators: [ deprecatedNotice ],
  args: {
    dateRange: true,
  }
}

export const MultiMonth: Story = {
  decorators: [ deprecatedNotice ],
  args: {
    dateRange: true,
    multiMonth: 3,
  }
}

export const WithPresets: Story = {
  decorators: [ deprecatedNotice ],
  args: {
    dateRange: true,
    multiMonth: 2,
    datePresets: true,
  }
}
