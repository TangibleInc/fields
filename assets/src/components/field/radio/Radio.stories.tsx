import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { RadioGroup } from './RadioGroup'
import Radio from './Radio'

const meta = {
  title: 'Field/Radio',
  component: RadioGroup,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    isDisabled: { control: 'boolean' },
    isRequired: { control: 'boolean' },
  },
  args: {
    label: 'Favourite colour',
  }
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="red">Red</Radio>
      <Radio value="green">Green</Radio>
      <Radio value="blue">Blue</Radio>
    </RadioGroup>
  )
}

export const WithDescription: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="sm">Small</Radio>
      <Radio value="md">Medium</Radio>
      <Radio value="lg">Large</Radio>
    </RadioGroup>
  ),
  args: {
    label: 'Size',
    description: 'Choose the size that best fits your needs.',
  }
}

export const PreSelected: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="draft">Draft</Radio>
      <Radio value="published">Published</Radio>
      <Radio value="archived">Archived</Radio>
    </RadioGroup>
  ),
  args: {
    label: 'Status',
    value: 'published',
  }
}

export const Disabled: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="yes">Yes</Radio>
      <Radio value="no">No</Radio>
    </RadioGroup>
  ),
  args: {
    label: 'Disabled group',
    isDisabled: true,
  }
}

export const DisabledOption: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="free">Free</Radio>
      <Radio value="pro" isDisabled>Pro (coming soon)</Radio>
      <Radio value="enterprise" isDisabled>Enterprise (coming soon)</Radio>
    </RadioGroup>
  ),
  args: {
    label: 'Plan',
  }
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <RadioGroup
          label="Pick one"
          value={value}
          onChange={setValue}
        >
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
          <Radio value="c">Option C</Radio>
        </RadioGroup>
        <p style={{ fontSize: '0.875rem', color: '#666' }}>
          Value: {value || '(none)'}
        </p>
      </div>
    )
  }
}
