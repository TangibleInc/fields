import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../../../index'

const meta = {
  title: 'Fields (Legacy)/List',
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
    type: 'list',
    label: 'List field',
    placeholder: 'Example placeholder',
    description: 'Example description',
    choices: {
      test1: 'Test 1',
      test2: 'Test 2',
      test3: 'Test 3',
    },
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

/**
 * Items are saved as a JSON array, an item with _canDelete false can't be
 * removed from the list
 */
export const WithValue: Story = {
  args: {
    value: JSON.stringify([
      { value: 'test1', _canDelete: true, _enabled: true },
      { value: 'test2', _canDelete: false, _enabled: true },
    ]),
  }
}

/**
 * The visibility button toggles _enabled, a disabled item stays in the value
 */
export const WithVisibility: Story = {
  args: {
    useVisibility: true,
    value: JSON.stringify([
      { value: 'test1', _canDelete: true, _enabled: true },
      { value: 'test2', _canDelete: true, _enabled: false },
    ]),
  }
}

export const DirectSelection: Story = {
  args: {
    directSelection: true,
  }
}
