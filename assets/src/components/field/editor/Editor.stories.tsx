import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../../../index'

/**
 * The editor field expects the tinyMCE global loaded by WordPress with
 * wp_enqueue_editor(), here it comes from the storybook static folder
 */
const loadTinyMce = () => new Promise(resolve => {
  if ( window.tinyMCE ) return resolve(true)
  const script = document.createElement('script')
  script.src = '/tinymce/tinymce.min.js'
  script.onload = () => resolve(true)
  document.head.appendChild(script)
})

const meta = {
  title: 'Fields (Legacy)/Editor',
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
    type: 'wysiwyg',
    label: 'Editor',
    placeholder: 'Example placeholder',
    description: 'Example description',
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutRawView: Story = {
  args: {
    rawView: false,
  }
}

export const WithValue: Story = {
  args: {
    value: '<h2>Title</h2><p>Content of the <strong>editor</strong></p>',
  }
}

export const TinyMce: Story = {
  loaders: [loadTinyMce],
  args: {
    editor: 'tinymce',
  }
}
