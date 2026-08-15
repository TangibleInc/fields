import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../index'

/**
 * A theming playground: one page with a broad spread of controls, for
 * eyeballing context themes (default / wp / elementor / beaver-builder — use
 * the toolbar) and light/dark modes side by side while editing theme files
 * like `assets/src/themes/wp.scss`.
 */

const choices = {
  one: 'Option one',
  two: 'Option two',
  three: 'Option three'
}

const column: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  minWidth: 0
}

const Playground = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px 32px',
      maxWidth: 960
    }}
  >
    <div style={column}>
      <Field type="text" name="pg-text" label="Text" description="A helper description" />
      <Field type="textarea" name="pg-textarea" label="Textarea" />
      <Field type="number" name="pg-number" label="Number" value="42" />
      <Field type="date-picker" name="pg-date" label="Date" />
      <Field type="time-picker" name="pg-time" label="Time" />
      <Field type="color-picker" name="pg-color" label="Color" value="#6366F1" />
      <Field type="gradient" name="pg-gradient" label="Gradient" />
    </div>

    <div style={column}>
      <Field type="select" name="pg-select" label="Select" choices={choices} />
      <Field
        type="select"
        name="pg-select-multi"
        label="Select (multiple)"
        multiple={true}
        choices={choices}
      />
      <Field type="combo-box" name="pg-combo" label="Combo box" choices={choices} />
      <Field type="button-group" name="pg-buttons" label="Button group" choices={choices} value="one" />
      <Field type="radio" name="pg-radio" label="Radio" choices={choices} value="one" />
      <Field type="checkbox" name="pg-checkbox" label="Checkbox" value={true} />
      <Field type="switch" name="pg-switch" label="Switch" value="on" />
      <Field type="switch" name="pg-switch-off" label="Switch (off)" value="off" />
    </div>

    <div style={{ ...column, gridColumn: '1 / -1' }}>
      <Field type="dimensions" name="pg-dimensions" label="Dimensions" />
      <Field type="simple-dimension" name="pg-simple-dimension" label="Simple dimension" />
      <Field type="alignment-matrix" name="pg-alignment" label="Alignment matrix" />
      <Field type="border" name="pg-border" label="Border" />
    </div>
  </div>
)

const meta = {
  title: 'Theming/Playground',
  component: Playground,
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof Playground>

export default meta

type Story = StoryObj<typeof meta>

export const AllControls: Story = {}
