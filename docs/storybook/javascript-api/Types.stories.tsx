import { useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field, types, utils } from '../../../assets/src/index'
import { column, output, parameters, decorators } from './shared'

/**
 * A custom field type storing a JSON value, built with two regular fields
 */
const UserForm = props => {

  const [value, setValue] = useState(utils.initJSON(props.value ?? {}))

  useEffect(() => {
    if (props.onChange) props.onChange(value)
  }, [value])

  return (
    <div style={ column }>
      <input type="hidden" name={ props.name ?? '' } value={ JSON.stringify(value) } />
      <Field
        type="text"
        label="First name"
        value={ value.firstName ?? '' }
        onChange={ firstName => setValue({ ...value, firstName }) }
      />
      <Field
        type="text"
        label="Last name"
        value={ value.lastName ?? '' }
        onChange={ lastName => setValue({ ...value, lastName }) }
      />
    </div>
  )
}

types.add('user-form', UserForm)

const meta = {
  title: 'JavaScript API/Custom types',
  component: Field,
  decorators,
  parameters
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The user-form type registered above, rendered like any other field
 */
export const CustomType: Story = {
  name: 'Custom type',
  render: () => {
    const [value, setValue] = useState({})
    return (
      <div style={ column }>
        <Field
          type="user-form"
          name="user"
          value='{"firstName":"Ada"}'
          onChange={ setValue }
        />
        <pre style={ output }>{ JSON.stringify(value) }</pre>
      </div>
    )
  },
  parameters: {
    docs: {
      source: {
        code: `const { Field, types, utils } = window.tangibleFields

const UserForm = props => {

  const [value, setValue] = useState(utils.initJSON(props.value ?? {}))

  useEffect(() => {
    if (props.onChange) props.onChange(value)
  }, [value])

  return (
    <>
      <input type="hidden" name={ props.name ?? '' } value={ JSON.stringify(value) } />
      <Field
        type="text"
        label="First name"
        value={ value.firstName ?? '' }
        onChange={ firstName => setValue({ ...value, firstName }) }
      />
      <Field
        type="text"
        label="Last name"
        value={ value.lastName ?? '' }
        onChange={ lastName => setValue({ ...value, lastName }) }
      />
    </>
  )
}

types.add('user-form', UserForm)

<Field type="user-form" name="user" value='{"firstName":"Ada"}' />`
      }
    }
  }
}
