import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../../../index'

const images = {
  11: '/images/example-1.jpg',
  12: '/images/example-2.jpg',
  13: '/images/example-3.jpg',
}

/**
 * Previews are fetched from the WordPress media REST API, here every
 * attachment id resolves to an image of the storybook static folder
 */
const mockMediaRequests = () => {

  const { fetch } = window

  window.fetch = url => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      source_url: images[String(url).match(/\d+/)?.[0]]
    })
  })

  return () => { window.fetch = fetch }
}

/**
 * The media library modal only exists in wp-admin, the frame returned here
 * selects every placeholder image instead of opening it
 */
const mockWpMedia = () => {

  const handlers = {}

  window.wp = {
    media: Object.assign(() => ({
      on: newHandlers => Object.assign(handlers, newHandlers),
      open: () => {
        handlers.open?.()
        handlers.update?.({
          models: Object.keys(images).map(id => ({ id: Number(id) }))
        })
      },
      menuView: { unset: () => {} }
    }), {
      query: () => ({ models: [], props: { toJSON: () => ({}) } }),
      model: { Selection: function () {} }
    })
  }

  return () => { delete window.wp }
}

const meta = {
  title: 'Fields (Legacy)/Gallery',
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
  beforeEach: [mockMediaRequests, mockWpMedia],
  args: {
    type: 'gallery',
    label: 'Gallery field',
    description: 'The media library is only available in WordPress, where the buttons open the media library modal, here they select example images',
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

/**
 * The attachment ids are saved as a comma separated list, an array of ids is
 * also accepted
 */
export const WithValue: Story = {
  args: {
    value: '11,12,13',
  }
}
