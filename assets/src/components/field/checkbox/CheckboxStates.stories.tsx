import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentType } from 'react'

import Checkbox from './Checkbox'
import LegacyCheckbox from './LegacyCheckbox'

const TuiCheckbox = Checkbox as ComponentType<any>
const OldCheckbox = LegacyCheckbox as ComponentType<any>

const meta = {
  title: 'Field/CheckboxComparison',
  parameters: {
    layout: 'padded'
  }
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const LegacyVsTui: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: '600px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '0.75rem', alignItems: 'start' }}>
        <strong>State</strong>
        <strong>Legacy</strong>
        <strong>TUI</strong>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '0.75rem', alignItems: 'start' }}>
        <strong>Default</strong>
        <OldCheckbox label="Accept terms" />
        <TuiCheckbox label="Accept terms" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '0.75rem', alignItems: 'start' }}>
        <strong>Checked</strong>
        <OldCheckbox label="Checked" isSelected={true} />
        <TuiCheckbox label="Checked" value={true} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '0.75rem', alignItems: 'start' }}>
        <strong>Disabled</strong>
        <OldCheckbox label="Disabled" isDisabled />
        <TuiCheckbox label="Disabled" isDisabled />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '0.75rem', alignItems: 'start' }}>
        <strong>Disabled + On</strong>
        <OldCheckbox label="Locked on" isSelected={true} isDisabled />
        <TuiCheckbox label="Locked on" value={true} isDisabled />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '0.75rem', alignItems: 'start' }}>
        <strong>Description</strong>
        <OldCheckbox label="With help" description="Extra context here." />
        <TuiCheckbox label="With help" description="Extra context here." />
      </div>
    </div>
  )
}

export const InteractiveComparison: Story = {
  render: () => {

    const [legacyChecked, setLegacyChecked] = useState(false)
    const [tuiChecked, setTuiChecked] = useState(false)

    return (
      <div style={{ display: 'grid', gap: '1rem', maxWidth: '600px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <strong>Legacy</strong>
            <OldCheckbox
              label="Toggle me"
              isSelected={legacyChecked}
              onChange={setLegacyChecked}
            />
            <p style={{ fontSize: '0.875rem', color: '#666' }}>
              Value: {String(legacyChecked)}
            </p>
          </div>
          <div>
            <strong>TUI</strong>
            <TuiCheckbox
              label="Toggle me"
              value={tuiChecked}
              onChange={setTuiChecked}
            />
            <p style={{ fontSize: '0.875rem', color: '#666' }}>
              Value: {String(tuiChecked)}
            </p>
          </div>
        </div>
      </div>
    )
  }
}
