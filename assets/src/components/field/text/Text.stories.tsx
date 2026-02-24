import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import Text from './Text'

const meta = {
  title: 'Field/Text',
  component: Text,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    placeholder: { control: 'text' },
    readOnly: { control: 'boolean' },
    inputMask: { control: 'text' },
    prefix: { control: 'text' },
    suffix: { control: 'text' }
  },
  args: {
    label: 'Label',
    description: 'Helper text',
    placeholder: 'Type here'
  }
} satisfies Meta<typeof Text>

export default meta

type Story = StoryObj<typeof meta>

export const SimpleTuiInput: Story = {
  args: {
    label: 'Simple Text',
    description: 'This path uses TUI TextInput',
    value: 'Hello world'
  }
}

export const MaskedEnhancedInput: Story = {
  args: {
    label: 'Masked Text',
    description: 'This path uses legacy dynamic text input (CodeMirror)',
    inputMask: '9999-99-99',
    value: '2026-02-24'
  }
}

export const PrefixSuffixEnhancedInput: Story = {
  args: {
    label: 'Prefixed Text',
    description: 'Prefix/suffix also routes through enhanced input mode',
    prefix: '$',
    suffix: ' USD',
    value: '19.99'
  }
}

export const InteractiveComparison: Story = {
  render: () => {
    const [simpleValue, setSimpleValue] = useState('Simple value')
    const [enhancedValue, setEnhancedValue] = useState('2026-02-24')

    return (
      <div style={{ display: 'grid', gap: '1rem', minWidth: '360px' }}>
        <Text
          label="Simple (TUI)"
          description="No dynamic features"
          value={simpleValue}
          onChange={setSimpleValue}
          placeholder="Plain text"
        />
        <Text
          label="Enhanced (Mask)"
          description="Masked/dynamic features enabled"
          value={enhancedValue}
          onChange={setEnhancedValue}
          inputMask="9999-99-99"
          placeholder="YYYY-MM-DD"
        />
      </div>
    )
  }
}

