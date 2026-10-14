import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field, store } from '../../../assets/src/index'
import { column, output, parameters, decorators } from './shared'

const meta = {
  title: 'JavaScript API/Store',
  component: Field,
  decorators,
  parameters
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Read the value of a field from the store, and set it from outside the field
 */
export const GetAndSet: Story = {
  name: 'Get and set a value',
  render: () => {
    const [read, setRead] = useState('')
    return (
      <div style={ column }>
        <Field type="text" name="store-field" label="Text" value="Initial value" />
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="tui-button" onClick={ () => setRead(store.getValue('store-field')) }>
            getValue
          </button>
          <button type="button" className="tui-button" onClick={ () => store.setValue('store-field', 'Set from the store') }>
            setValue
          </button>
        </div>
        <pre style={ output }>Read: { read }</pre>
      </div>
    )
  },
  parameters: {
    docs: {
      source: {
        code: `const { store } = window.tangibleFields

store.getValue('store-field')
store.setValue('store-field', 'Set from the store')`
      }
    }
  }
}
