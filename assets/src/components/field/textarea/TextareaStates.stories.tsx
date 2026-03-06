import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentType } from 'react'

import TextArea from './TextArea'
import LegacyTextArea from './LegacyTextArea'

const TuiTextArea = TextArea as ComponentType<any>
const OldTextArea = LegacyTextArea as ComponentType<any>

const meta = {
  title: 'Field/TextareaComparison',
  parameters: {
    layout: 'padded'
  }
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const LegacyVsTui: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '800px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '0.75rem', alignItems: 'start' }}>
        <strong>State</strong>
        <strong>Legacy</strong>
        <strong>TUI</strong>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '0.75rem', alignItems: 'start' }}>
        <strong>Default</strong>
        <OldTextArea label="Default" placeholder="Enter text..." />
        <TuiTextArea label="Default" placeholder="Enter text..." />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '0.75rem', alignItems: 'start' }}>
        <strong>With value</strong>
        <OldTextArea label="Filled" value="Pre-filled content." />
        <TuiTextArea label="Filled" value="Pre-filled content." />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '0.75rem', alignItems: 'start' }}>
        <strong>Read-only</strong>
        <OldTextArea label="Read-only" value="Cannot edit this." readOnly />
        <TuiTextArea label="Read-only" value="Cannot edit this." readOnly />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '0.75rem', alignItems: 'start' }}>
        <strong>Disabled</strong>
        <OldTextArea label="Disabled" value="Disabled textarea" isDisabled />
        <TuiTextArea label="Disabled" value="Disabled textarea" isDisabled />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '0.75rem', alignItems: 'start' }}>
        <strong>Description</strong>
        <OldTextArea label="With help" description="Markdown supported." placeholder="Write..." />
        <TuiTextArea label="With help" description="Markdown supported." placeholder="Write..." />
      </div>
    </div>
  )
}

export const InteractiveComparison: Story = {
  render: () => {
    const [legacyValue, setLegacyValue] = useState('')
    const [tuiValue, setTuiValue] = useState('')

    return (
      <div style={{ display: 'grid', gap: '1rem', maxWidth: '800px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <strong>Legacy</strong>
            <OldTextArea
              label="Type here"
              value={legacyValue}
              onChange={setLegacyValue}
              rows={4}
              placeholder="Legacy textarea..."
            />
            <p style={{ fontSize: '0.875rem', color: '#666' }}>
              Length: {legacyValue.length}
            </p>
          </div>
          <div>
            <strong>TUI</strong>
            <TuiTextArea
              label="Type here"
              value={tuiValue}
              onChange={setTuiValue}
              rows={4}
              placeholder="TUI textarea..."
            />
            <p style={{ fontSize: '0.875rem', color: '#666' }}>
              Length: {tuiValue.length}
            </p>
          </div>
        </div>
      </div>
    )
  }
}
