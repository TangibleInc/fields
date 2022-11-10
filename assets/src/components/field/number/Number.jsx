import { useRef } from 'react'
import { useNumberFieldState } from 'react-stately'

import { 
  useLocale, 
  useNumberField 
} from 'react-aria'

import { Button } from '../../base/'

const Number = props => {

  const { locale } = useLocale()
  const state = useNumberFieldState({ ...props, locale })
  const inputRef = useRef()

  const {
    labelProps,
    groupProps,
    inputProps,
    incrementButtonProps,
    decrementButtonProps
  } = useNumberField(props, state, inputRef)

  return (
    <div class='tf-number'>
      <label { ...labelProps }>
        { props.label }
      </label>
      <div div class='tf-number-field' { ...groupProps }>
        <input { ...inputProps} ref={ inputRef } />
        <div class='tf-number-button-group'>
          <Button type="number" { ...incrementButtonProps }>+</Button>
          <Button type="number" { ...decrementButtonProps }>-</Button>
        </div>
      </div>
    </div>
  )
}

export default Number
