import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../../../index'

const meta = {
  title: 'Fields (Legacy)/File',
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
    type: 'file',
    label: 'File',
    description: 'Description',
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NativeInput: Story = {
  args: {
    wpMedia: false,
  }
}

export const ImageOnly: Story = {
  args: {
    mimeTypes: [
      'image/jpeg',
      'image/gif',
      'image/png',
      'image/webp',
    ],
  }
}

export const VideoAndImage: Story = {
  args: {
    mimeTypes: ['video', 'image'],
  }
}

export const MaxUploads: Story = {
  args: {
    maxUpload: 2,
  }
}
