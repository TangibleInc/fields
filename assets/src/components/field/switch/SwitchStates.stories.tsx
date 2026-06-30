import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentType } from 'react'

import Switch from './Switch'
import LegacySwitch from './LegacySwitch'

const TuiSwitch = Switch as ComponentType<any>
const OldSwitch = LegacySwitch as ComponentType<any>

const meta = {
  title: 'Field/SwitchComparison',
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
        <strong>Default (off)</strong>
        <OldSwitch label="Default" />
        <TuiSwitch label="Default" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '0.75rem', alignItems: 'start' }}>
        <strong>On</strong>
        <OldSwitch label="On" isSelected={true} />
        <TuiSwitch label="On" value={true} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '0.75rem', alignItems: 'start' }}>
        <strong>Disabled</strong>
        <OldSwitch label="Disabled" isDisabled />
        <TuiSwitch label="Disabled" isDisabled />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '0.75rem', alignItems: 'start' }}>
        <strong>Disabled + On</strong>
        <OldSwitch label="Locked on" isSelected={true} isDisabled />
        <TuiSwitch label="Locked on" value={true} isDisabled />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '0.75rem', alignItems: 'start' }}>
        <strong>Description</strong>
        <OldSwitch label="With help" description="Toggle this setting." />
        <TuiSwitch label="With help" description="Toggle this setting." />
      </div>
    </div>
  )
}

export const InteractiveComparison: Story = {
  render: () => {
    const [legacyOn, setLegacyOn] = useState(false)
    const [tuiOn, setTuiOn] = useState(false)

    return (
      <div style={{ display: 'grid', gap: '1rem', maxWidth: '600px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <strong>Legacy</strong>
            <OldSwitch
              label="Toggle me"
              isSelected={legacyOn}
              onChange={setLegacyOn}
            />
            <p style={{ fontSize: '0.875rem', color: '#666' }}>
              Value: {String(legacyOn)}
            </p>
          </div>
          <div>
            <strong>TUI</strong>
            <TuiSwitch
              label="Toggle me"
              value={tuiOn}
              onChange={setTuiOn}
            />
            <p style={{ fontSize: '0.875rem', color: '#666' }}>
              Value: {String(tuiOn)}
            </p>
          </div>
        </div>
      </div>
    )
  }
}
