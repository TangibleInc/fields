import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentType } from 'react'

import Button from './Button'
import LegacyButton from './LegacyButton'

const TuiButton = Button as ComponentType<any>
const LegacyButtonComponent = LegacyButton as ComponentType<any>

const variants = [
  { layout: 'primary', label: 'Primary' },
  { layout: 'action', label: 'Action' },
  { layout: 'danger', label: 'Danger' },
  { layout: 'text-action', label: 'Text Action' },
  { layout: 'text-primary', label: 'Text Primary' },
  { layout: 'text-danger', label: 'Text Danger' }
] as const

const meta = {
  title: 'Base/ButtonComparison',
  parameters: {
    layout: 'padded'
  }
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const LegacyVsTui: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {variants.map(variant => (
        <div
          key={variant.layout}
          style={{
            display: 'grid',
            gridTemplateColumns: '140px auto auto',
            gap: '1rem',
            alignItems: 'center'
          }}
        >
          <strong>{variant.layout}</strong>
          <LegacyButtonComponent layout={variant.layout} content={`Legacy ${variant.label}`} />
          <TuiButton layout={variant.layout} content={`TUI ${variant.label}`} />
        </div>
      ))}
    </div>
  )
}
