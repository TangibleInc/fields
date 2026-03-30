import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../../../index'

const simpleChoices = {
  test1: 'Test1',
  test2: 'Test2',
  test3: 'Test3',
  test4: 'Test4',
}

const categoryChoices = [
  {
    name: 'Category 1',
    choices: {
      test1: 'Test1',
      test2: 'Test2',
    }
  },
  {
    name: 'Category 2',
    choices: {
      test3: 'Test3',
      test4: 'Test4',
    }
  }
]

const meta = {
  title: 'Fields (Legacy)/ComboBox',
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
    type: 'combo-box',
    label: 'ComboBox',
    placeholder: 'Example placeholder',
    description: 'Example description',
    choices: simpleChoices,
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Multiple: Story = {
  args: {
    multiple: true,
  }
}

export const WithCategories: Story = {
  args: {
    choices: categoryChoices,
  }
}

export const MultiplWithCategories: Story = {
  args: {
    multiple: true,
    choices: categoryChoices,
  }
}
