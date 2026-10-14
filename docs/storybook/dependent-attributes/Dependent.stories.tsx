import type { Meta, StoryObj } from '@storybook/react-vite'

import { Icon } from '@tangible/ui'

import { Field } from '../../../assets/src/index'

const row = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 16,
  maxWidth: 520
}

const meta = {
  title: 'Features/Dependent Attributes',
  component: Field,
  decorators: [
    Story => (
      <div style={{ minWidth: '500px' }}>
        <Story />
      </div>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      toc: {
        headingSelector: 'h2, h3',
        title: 'Contents'
      }
    }
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The label and the description of the last field are the values of the two
 * other fields
 */
export const Attributes: Story = {
  render: () => (
    <div style={ row }>
      <Field
        type="text"
        name="label-field"
        label="Set the label of the last field"
        value="Label from the first field"
      />
      <Field
        type="text"
        name="description-field"
        label="Set the description of the last field"
        value="Description from the second field"
      />
      <Field
        type="text"
        name="custom-field"
        label="{{label-field}}"
        description="{{description-field}}"
        dependent={ true }
      />
    </div>
  )
}

/**
 * A dependent value can be mixed with regular text, and `field-name.attribute`
 * uses a single attribute of an object value
 */
export const PartialValue: Story = {
  render: () => (
    <div style={ row }>
      <Field
        type="dimensions"
        name="partial-dimensions"
        label="Dimensions"
        description="Change the unit to update the field below"
        units={ ['px', '%'] }
        value={{ top: 0, left: 0, right: 0, bottom: 0, unit: 'px', isLinked: false }}
      />
      <Field
        type="text"
        name="partial-target"
        label="The dimensions unit is {{partial-dimensions.unit}}"
        dependent={ true }
      />
    </div>
  )
}

/**
 * The switch enables or disables the opacity of the color picker
 */
export const Boolean: Story = {
  render: () => (
    <div style={ row }>
      <Field
        type="switch"
        name="opacity-switch"
        label="Enable opacity"
        valueOn={ true }
        valueOff={ false }
        value={ false }
      />
      <Field
        type="color-picker"
        name="opacity-color"
        label="Color"
        value="#2E3338"
        hasAlpha="{{opacity-switch}}"
        dependent={ true }
      />
    </div>
  )
}

/**
 * The callback formats the value before it is used as an attribute, and can
 * return an element
 */
export const Callback: Story = {
  render: () => (
    <div style={ row }>
      <Field
        type="switch"
        name="callback-switch"
        label="Switch"
        valueOn="yes"
        valueOff="no"
        value="no"
      />
      <Field
        type="text"
        name="callback-text"
        label="Text field"
        description="{{callback-switch}}"
        dependent={{
          callback: ({ attribute, value }) => {
            if (attribute !== 'description') return value
            return value === 'yes'
              ? <><Icon name="system/check-circle-fill" /> The switch is enabled</>
              : <><Icon name="system/close-circle-fill" /> The switch is disabled</>
          }
        }}
      />
    </div>
  )
}

/**
 * Inside a repeater, a dependent value is taken from the current row
 */
export const Repeater: Story = {
  render: () => (
    <div style={ row }>
      <Field
        type="repeater"
        name="dependent-repeater"
        layout="block"
        value={[
          { key: 'row-1', 'row-label': 'Row label', 'row-target': '' }
        ]}
        fields={[
          {
            name: 'row-label',
            type: 'text',
            label: 'Label of the field below'
          },
          {
            name: 'row-target',
            type: 'text',
            label: '{{row-label}}',
            dependent: true
          }
        ]}
      />
    </div>
  )
}
