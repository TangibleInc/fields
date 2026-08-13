import { useState, useEffect } from 'react'
import { initJSON } from '../../../utils'

import Single from './Single'
import Multiple from './Multiple'

/**
 * combo-box entry. Routes to the single- or multi-select TUI wrapper and owns
 * the value state + hidden input for form submission.
 *
 * Value contract (unchanged from the react-aria implementation):
 *  - static single:   value (string)        hidden: value
 *  - static multiple: "a,b,c"               hidden: value
 *  - async single:    { value, label }      hidden: JSON
 *  - async multiple:  [{ value, label }]    hidden: JSON
 *
 * @see control-list.js (PHP side reads the hidden input)
 */
export default (props: any) => {
  const isAsync = Boolean(props.isAsync)

  const [value, setValue] = useState<any>(() =>
    isAsync ? initJSON(props.value ?? '') : props.value ?? ''
  )

  useEffect(() => {
    props.onChange && props.onChange(value)
  }, [value])

  const Component = props.multiple ? Multiple : Single

  return (
    <>
      <input
        type="hidden"
        name={props.name ?? ''}
        value={isAsync ? JSON.stringify(value) : value ?? ''}
      />
      <Component {...props} value={value} onChange={setValue} />
    </>
  )
}
