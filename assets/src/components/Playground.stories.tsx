import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../index'
import { Notice } from '@tangible/ui'

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

/**
 * `context` must thread into every Field: portaled content (select listboxes,
 * popovers) re-applies its wrapper from the field's own context prop — without
 * it, dropdowns render in the default context regardless of the toolbar.
 */
const Playground = ({ context }: { context?: string }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px 32px',
      maxWidth: 960
    }}
  >
    <div style={column}>
      <Field context={context} type="text" name="pg-text" label="Text" description="A helper description" />
      <Field context={context} type="textarea" name="pg-textarea" label="Textarea" />
      <Field context={context} type="number" name="pg-number" label="Number" value="42" />
      <Field context={context} type="date-picker" name="pg-date" label="Date" />
      <Field context={context} type="time-picker" name="pg-time" label="Time" />
      <Field context={context} type="color-picker" name="pg-color" label="Color" value="#6366F1" />
      <Field context={context} type="gradient" name="pg-gradient" label="Gradient" />
    </div>

    <div style={column}>
      <Field context={context} type="select" name="pg-select" label="Select" choices={choices} />
      <Field
        context={context}
        type="select"
        name="pg-select-multi"
        label="Select (multiple)"
        multiple={true}
        choices={choices}
      />
      <Field context={context} type="combo-box" name="pg-combo" label="Combo box" choices={choices} />
      <Field context={context} type="button-group" name="pg-buttons" label="Button group" choices={choices} value="one" />
      <Field context={context} type="radio" name="pg-radio" label="Radio" choices={choices} value="one" />
      <Field context={context} type="checkbox" name="pg-checkbox" label="Checkbox" value={true} />
      <Field context={context} type="switch" name="pg-switch" label="Switch" value="on" />
      <Field context={context} type="switch" name="pg-switch-off" label="Switch (off)" value="off" />
    </div>

    <div style={{ ...column, gridColumn: '1 / -1' }}>
      {(['info', 'success', 'warning', 'danger'] as const).map(theme => (
        <Notice key={theme} theme={theme}>
          <Notice.Head title={`Notice (${theme})`} />
          <Notice.Body>A theme-coloured notice for context theming.</Notice.Body>
        </Notice>
      ))}
      <Field context={context} type="dimensions" name="pg-dimensions" label="Dimensions" />
      <Field context={context} type="simple-dimension" name="pg-simple-dimension" label="Simple dimension" />
      <Field context={context} type="alignment-matrix" name="pg-alignment" label="Alignment matrix" />
      <Field context={context} type="border" name="pg-border" label="Border" />
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
