import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../../../index'

const textChoices = {
  one: 'One',
  two: 'Two',
  three: 'Three',
}

const dashiconChoices = {
  left: 'editor-alignleft',
  center: 'editor-aligncenter',
  right: 'editor-alignright',
}

const meta = {
  title: 'Fields (Legacy)/Button Group',
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
    type: 'button-group',
    label: 'Button group',
    description: 'Example description',
    choices: textChoices,
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithDashicons: Story = {
  args: {
    use_dashicon: true,
    choices: dashiconChoices,
  }
}
