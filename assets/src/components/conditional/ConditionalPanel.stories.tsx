import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field, setConfig } from '../../index'

const operators = {
  _eq: 'Is',
  _neq: 'Is not',
  _lt: 'Less than',
  _gt: 'Greater than',
}

/**
 * Dynamic values for the condition inputs. Matches the Dynamic Values story
 * config so the global dynamics config stays consistent between stories.
 */
const dynamics = {
  categories: {
    post: { label: 'Post', name: 'post', values: ['post-title', 'post-date', 'post-id'] },
    site: { label: 'Site', name: 'site', values: ['site-title', 'site-color'] },
  },
  values: {
    'post-title': { category: 'post', name: 'post-title', label: 'Post title', type: 'text', fields: [] },
    'post-date': { category: 'post', name: 'post-date', label: 'Post date', type: 'date', fields: [] },
    'post-id': { category: 'post', name: 'post-id', label: 'Post ID', type: 'number', fields: [] },
    'site-title': { category: 'site', name: 'site-title', label: 'Site title', type: 'text', fields: [] },
    'site-color': { category: 'site', name: 'site-color', label: 'Site color', type: 'color', fields: [] },
  }
}

const meta = {
  title: 'Fields (Legacy)/Conditional Panel',
  component: Field,
  decorators: [
    Story => {
      setConfig({ dynamics })
      return (
        <div style={{ minWidth: '500px' }}>
          <Story />
        </div>
      )
    }
  ],
  parameters: {
    layout: 'padded'
  },
  args: {
    type: 'conditional-panel',
    operators,
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithModal: Story = {
  args: {
    useModal: true,
  }
}
