import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field, Element } from '../../../assets/src/index'
import { column, output, parameters, decorators } from './shared'

const meta = {
  title: 'JavaScript API/Render',
  component: Field,
  decorators,
  parameters
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

/**
 * A field rendered from JavaScript, with an onChange callback
 */
export const RenderField: Story = {
  name: 'Render a field',
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div style={ column }>
        <Field
          type="text"
          name="render-field"
          label="Text"
          onChange={ setValue }
        />
        <pre style={ output }>Value: { value }</pre>
      </div>
    )
  },
  parameters: {
    docs: {
      source: {
        code: `const { Field } = window.tangibleFields

<Field
  type="text"
  name="render-field"
  label="Text"
  onChange={ value => console.log(value) }
/>`
      }
    }
  }
}

/**
 * An element rendered from JavaScript
 */
export const RenderElement: Story = {
  name: 'Render an element',
  render: () => (
    <Element
      type="button"
      name="render-element"
      layout="primary"
      content="Button"
    />
  ),
  parameters: {
    docs: {
      source: {
        code: `const { Element } = window.tangibleFields

<Element
  type="button"
  name="render-element"
  layout="primary"
  content="Button"
/>`
      }
    }
  }
}
