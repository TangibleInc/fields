import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentType } from 'react'

import Notice from './Notice'
import LegacyNotice from './LegacyNotice'

const TuiNotice = Notice as ComponentType<any>
const OldNotice = LegacyNotice as ComponentType<any>

const meta = {
  title: 'Base/NoticeComparison',
  parameters: {
    layout: 'padded'
  }
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const types = ['info', 'success', 'warning', 'error'] as const

export const LegacyVsTui: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '2rem', maxWidth: '800px' }}>
      {types.map(type => (
        <div key={type}>
          <strong style={{ display: 'block', marginBottom: '0.5rem' }}>{type}</strong>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.25rem' }}>Legacy</div>
              <OldNotice message={`Legacy ${type} notice`} type={type} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.25rem' }}>TUI</div>
              <TuiNotice message={`TUI ${type} notice`} type={type} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export const DismissibleComparison: Story = {
  render: () => {
    const [legacyVisible, setLegacyVisible] = useState(true)
    const [tuiVisible, setTuiVisible] = useState(true)

    return (
      <div style={{ display: 'grid', gap: '1rem', maxWidth: '800px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <strong>Legacy</strong>
            {legacyVisible
              ? <OldNotice message="Dismiss me" type="info" onDismiss={() => setLegacyVisible(false)} />
              : <button onClick={() => setLegacyVisible(true)}>Reset</button>
            }
          </div>
          <div>
            <strong>TUI</strong>
            {tuiVisible
              ? <TuiNotice message="Dismiss me" type="info" onDismiss={() => setTuiVisible(false)} />
              : <button onClick={() => setTuiVisible(true)}>Reset</button>
            }
          </div>
        </div>
      </div>
    )
  }
}
