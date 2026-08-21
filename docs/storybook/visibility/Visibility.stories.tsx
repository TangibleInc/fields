import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field, Element } from '../../../assets/src/index'

const row = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 16,
  maxWidth: 520
}

const meta = {
  title: 'Features/Field Visibility',
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
 * The field is displayed when the condition matches
 */
export const Show: Story = {
  render: () => (
    <div style={ row }>
      <Field
        type="text"
        name="visibility-text"
        label="Text input"
        description='Type "show" to display the field below'
      />
      <Field
        type="text"
        name="visibility-target"
        label='Visible when the text input is "show"'
        condition={{
          action: 'show',
          condition: {
            'visibility-text': { _eq: 'show' }
          }
        }}
      />
    </div>
  )
}

/**
 * With the `hide` action, the field is removed when the condition matches
 */
export const Hide: Story = {
  render: () => (
    <div style={ row }>
      <Field
        type="text"
        name="hide-source"
        label="Text input"
        description='Type "hide" to remove the field below'
      />
      <Field
        type="text"
        name="hide-target"
        label='Hidden when the text input is "hide"'
        condition={{
          action: 'hide',
          condition: {
            'hide-source': { _eq: 'hide' }
          }
        }}
      />
    </div>
  )
}

/**
 * Each result is a `description` element with its own condition, which also
 * shows that elements support the same syntax as fields
 */
export const Equal: Story = {
  render: () => (
    <div style={ row }>
      <Field
        type="text"
        name="operator-eq"
        label="_eq / _neq"
        value="test"
        description='Compared to "test"'
      />
      <Element
        type="description"
        content='_eq — is "test"'
        condition={{
          condition: {
            'operator-eq': { _eq: 'test' }
          }
        }}
      />
      <Element
        type="description"
        content='_neq — is not "test"'
        condition={{
          condition: {
            'operator-eq': { _neq: 'test' }
          }
        }}
      />
    </div>
  )
}

export const Contains: Story = {
  render: () => (
    <div style={ row }>
      <Field
        type="text"
        name="operator-contains"
        label="_contains / _ncontains"
        value="test"
        description='Compared to "es"'
      />
      <Element
        type="description"
        content='_contains — contains "es"'
        condition={{
          condition: {
            'operator-contains': { _contains: 'es' }
          }
        }}
      />
      <Element
        type="description"
        content={ `_ncontains — doesn't contain "es"` }
        condition={{
          condition: {
            'operator-contains': { _ncontains: 'es' }
          }
        }}
      />
    </div>
  )
}

export const InArray: Story = {
  render: () => (
    <div style={ row }>
      <Field
        type="text"
        name="operator-in"
        label="_in / _nin"
        value="test"
        description='Compared to ["test", "other"]'
      />
      <Element
        type="description"
        content='_in — is "test" or "other"'
        condition={{
          condition: {
            'operator-in': { _in: ['test', 'other'] }
          }
        }}
      />
      <Element
        type="description"
        content='_nin — is neither "test" nor "other"'
        condition={{
          condition: {
            'operator-in': { _nin: ['test', 'other'] }
          }
        }}
      />
    </div>
  )
}

export const LessThan: Story = {
  render: () => (
    <div style={ row }>
      <Field
        type="number"
        name="operator-lt"
        label="_lt / _gte"
        value="10"
        description="Compared to 10"
      />
      <Element
        type="description"
        content="_lt — is less than 10"
        condition={{
          condition: {
            'operator-lt': { _lt: 10 }
          }
        }}
      />
      <Element
        type="description"
        content="_gte — is 10 or more"
        condition={{
          condition: {
            'operator-lt': { _gte: 10 }
          }
        }}
      />
    </div>
  )
}

export const GreaterThan: Story = {
  render: () => (
    <div style={ row }>
      <Field
        type="number"
        name="operator-gt"
        label="_gt / _lte"
        value="10"
        description="Compared to 10"
      />
      <Element
        type="description"
        content="_gt — is greater than 10"
        condition={{
          condition: {
            'operator-gt': { _gt: 10 }
          }
        }}
      />
      <Element
        type="description"
        content="_lte — is 10 or less"
        condition={{
          condition: {
            'operator-gt': { _lte: 10 }
          }
        }}
      />
    </div>
  )
}

export const Regex: Story = {
  render: () => (
    <div style={ row }>
      <Field
        type="text"
        name="operator-re"
        label="_re"
        value="test"
        description="Compared to the ^te expression"
      />
      <Element
        type="description"
        content='_re — starts with "te"'
        condition={{
          condition: {
            'operator-re': { _re: '^te' }
          }
        }}
      />
    </div>
  )
}

/**
 * Several conditions can be grouped with `_and` or `_or`
 */
export const Relations: Story = {
  render: () => (
    <div style={ row }>
      <Field
        type="text"
        name="relation-first"
        label="First value"
        description='Type "a" here'
      />
      <Field
        type="text"
        name="relation-second"
        label="Second value"
        description='Type "b" here'
      />
      <Field
        type="text"
        name="relation-and"
        label='Visible when first is "a" and second is "b"'
        condition={{
          condition: {
            _and: [
              { 'relation-first': { _eq: 'a' } },
              { 'relation-second': { _eq: 'b' } }
            ]
          }
        }}
      />
      <Field
        type="text"
        name="relation-or"
        label='Visible when first is "a" or second is "b"'
        condition={{
          condition: {
            _or: [
              { 'relation-first': { _eq: 'a' } },
              { 'relation-second': { _eq: 'b' } }
            ]
          }
        }}
      />
    </div>
  )
}

/**
 * When a field stores an object, `field-name.attribute` compares one of
 * its attributes
 */
export const PartialValue: Story = {
  render: () => (
    <div style={ row }>
      <Field
        type="dimensions"
        name="partial-dimensions"
        label="Dimensions"
        description="Select the % unit to display the field below"
        units={ ['px', '%'] }
      />
      <Field
        type="text"
        name="partial-target"
        label="Visible when the dimensions unit is %"
        condition={{
          condition: {
            'partial-dimensions.unit': { _eq: '%' }
          }
        }}
      />
    </div>
  )
}

/**
 * Sub-field conditions are evaluated row by row, against the values of the
 * current row
 */
export const Repeater: Story = {
  render: () => (
    <div style={ row }>
      <Field
        type="text"
        name="repeater-source"
        label="Text input"
        description='Type "show repeater" to display the repeater'
      />
      <Field
        type="repeater"
        name="repeater-visibility"
        layout="block"
        condition={{
          condition: {
            'repeater-source': { _eq: 'show repeater' }
          }
        }}
        fields={[
          {
            name: 'subfield-number',
            type: 'number',
            label: 'Number'
          },
          {
            name: 'subfield-text',
            type: 'text',
            label: 'Visible when the number is 10 or more',
            condition: {
              condition: {
                'subfield-number': { _gte: 10 }
              }
            }
          },
          {
            name: 'subfield-other',
            type: 'text',
            label: 'Visible when the number is less than 10, or the text above contains "third"',
            condition: {
              condition: {
                _or: [
                  { 'subfield-number': { _lt: 10 } },
                  { 'subfield-text': { _contains: 'third' } }
                ]
              }
            }
          }
        ]}
      />
    </div>
  )
}
