import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../../index'

/**
 * Repeater layouts rendered through the public Field entry, the same way PHP
 * config reaches them. `context` threads into every field so portaled
 * content (confirm dialogs, select listboxes) lands in the right theme.
 */

const fields = [
  { type: 'text',   name: 'title',    label: 'Title' },
  { type: 'select', name: 'status',   label: 'Status', choices: { draft: 'Draft', live: 'Live' } },
  { type: 'number', name: 'priority', label: 'Priority' }
]

const value = [
  { key: 'a', title: 'First item',  status: 'live',  priority: 1 },
  { key: 'b', title: 'Second item', status: 'draft', priority: 2 },
  { key: 'c', title: 'Third item',  status: 'live',  priority: 3 }
]

type Args = {
  context?: string
  layout: 'advanced' | 'block' | 'table' | 'bare' | 'tab'
  useBulk?: boolean
  maxlength?: number
}

const Repeater = ({ context, layout, useBulk, maxlength }: Args) => (
  <div style={{ maxWidth: 760 }}>
    <Field
      context={ context }
      type="repeater"
      layout={ layout }
      name={ `story-repeater-${layout}` }
      label={ `${layout} repeater` }
      fields={ fields }
      value={ value }
      useBulk={ useBulk }
      maxlength={ maxlength }
    />
  </div>
)

const meta = {
  title: 'Repeater/Layouts',
  component: Repeater,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    layout: { control: 'select', options: ['advanced', 'block', 'table', 'bare', 'tab'] },
    useBulk: { control: 'boolean' },
    maxlength: { control: 'number' }
  }
} satisfies Meta<typeof Repeater>

export default meta
type Story = StoryObj<typeof meta>

export const Advanced: Story = {
  args: { layout: 'advanced' }
}

export const AdvancedWithBulk: Story = {
  args: { layout: 'advanced', useBulk: true }
}

export const Block: Story = {
  args: { layout: 'block' }
}

export const Table: Story = {
  args: { layout: 'table' }
}

export const Tab: Story = {
  args: { layout: 'tab' }
}
