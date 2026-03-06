import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import Notice from './Notice'

const meta = {
  title: 'Base/Notice',
  component: Notice,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info'],
    },
    message: { control: 'text' },
  },
  args: {
    message: 'This is a notice message.',
    type: 'info',
  }
} satisfies Meta<typeof Notice>

export default meta

type Story = StoryObj<typeof meta>

export const Info: Story = {
  args: {
    message: 'Your changes have been saved.',
    type: 'info',
  }
}

export const Success: Story = {
  args: {
    message: 'Settings updated successfully.',
    type: 'success',
  }
}

export const Warning: Story = {
  args: {
    message: 'This action cannot be undone.',
    type: 'warning',
  }
}

export const Error: Story = {
  args: {
    message: 'Something went wrong. Please try again.',
    type: 'error',
  }
}

export const Dismissible: Story = {
  render: () => {
    const [visible, setVisible] = useState(true)
    return visible
      ? <Notice
          message="You can dismiss this notice."
          type="info"
          onDismiss={() => setVisible(false)}
        />
      : <button onClick={() => setVisible(true)}>Show notice again</button>
  }
}

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '0.75rem', minWidth: '400px' }}>
      <Notice message="Info: General information." type="info" />
      <Notice message="Success: Operation completed." type="success" />
      <Notice message="Warning: Proceed with caution." type="warning" />
      <Notice message="Error: Something failed." type="error" />
    </div>
  )
}
