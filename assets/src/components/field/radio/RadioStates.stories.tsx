import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentType } from 'react'

import { RadioGroup } from './RadioGroup'
import Radio from './Radio'
import { RadioGroup as LegacyRadioGroup } from './LegacyRadioGroup'
import LegacyRadio from './LegacyRadio'

const TuiRadioGroup = RadioGroup as ComponentType<any>
const TuiRadio = Radio as ComponentType<any>
const OldRadioGroup = LegacyRadioGroup as ComponentType<any>
const OldRadio = LegacyRadio as ComponentType<any>

const meta = {
  title: 'Field/RadioComparison',
  parameters: {
    layout: 'padded'
  }
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const LegacyVsTui: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '2rem', maxWidth: '700px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Legacy — Default</strong>
          <OldRadioGroup label="Pick one">
            <OldRadio value="a">Option A</OldRadio>
            <OldRadio value="b">Option B</OldRadio>
            <OldRadio value="c">Option C</OldRadio>
          </OldRadioGroup>
        </div>
        <div>
          <strong style={{ display: 'block', marginBottom: '0.5rem' }}>TUI — Default</strong>
          <TuiRadioGroup label="Pick one">
            <TuiRadio value="a">Option A</TuiRadio>
            <TuiRadio value="b">Option B</TuiRadio>
            <TuiRadio value="c">Option C</TuiRadio>
          </TuiRadioGroup>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Legacy — Pre-selected</strong>
          <OldRadioGroup label="Preselected" value="b">
            <OldRadio value="a">Option A</OldRadio>
            <OldRadio value="b">Option B</OldRadio>
            <OldRadio value="c">Option C</OldRadio>
          </OldRadioGroup>
        </div>
        <div>
          <strong style={{ display: 'block', marginBottom: '0.5rem' }}>TUI — Pre-selected</strong>
          <TuiRadioGroup label="Preselected" value="b">
            <TuiRadio value="a">Option A</TuiRadio>
            <TuiRadio value="b">Option B</TuiRadio>
            <TuiRadio value="c">Option C</TuiRadio>
          </TuiRadioGroup>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Legacy — Disabled</strong>
          <OldRadioGroup label="Disabled" isDisabled>
            <OldRadio value="a">Option A</OldRadio>
            <OldRadio value="b">Option B</OldRadio>
          </OldRadioGroup>
        </div>
        <div>
          <strong style={{ display: 'block', marginBottom: '0.5rem' }}>TUI — Disabled</strong>
          <TuiRadioGroup label="Disabled" isDisabled>
            <TuiRadio value="a">Option A</TuiRadio>
            <TuiRadio value="b">Option B</TuiRadio>
          </TuiRadioGroup>
        </div>
      </div>
    </div>
  )
}

export const InteractiveComparison: Story = {
  render: () => {
    const [legacyValue, setLegacyValue] = useState('a')
    const [tuiValue, setTuiValue] = useState('a')

    return (
      <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '700px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <strong>Legacy</strong>
            <OldRadioGroup label="Choose" value={legacyValue} onChange={setLegacyValue}>
              <OldRadio value="a">Option A</OldRadio>
              <OldRadio value="b">Option B</OldRadio>
              <OldRadio value="c">Option C</OldRadio>
            </OldRadioGroup>
            <p style={{ fontSize: '0.875rem', color: '#666' }}>
              Selected: {legacyValue}
            </p>
          </div>
          <div>
            <strong>TUI</strong>
            <TuiRadioGroup label="Choose" value={tuiValue} onChange={setTuiValue}>
              <TuiRadio value="a">Option A</TuiRadio>
              <TuiRadio value="b">Option B</TuiRadio>
              <TuiRadio value="c">Option C</TuiRadio>
            </TuiRadioGroup>
            <p style={{ fontSize: '0.875rem', color: '#666' }}>
              Selected: {tuiValue}
            </p>
          </div>
        </div>
      </div>
    )
  }
}
