import { useRef } from 'react'
import { useNumberFieldState } from 'react-stately'

import { 
  useLocale, 
  useNumberField 
} from 'react-aria'

import { 
  Button,
  Description,
  Label
} from '../../base/'

const Number = props => {

  const { locale } = useLocale()
  const state = useNumberFieldState({ ...props, locale })
  const inputRef = useRef()

  const {
    labelProps,
    descriptionProps,
    groupProps,
    inputProps,
    incrementButtonProps,
    decrementButtonProps
  } = useNumberField(props, state, inputRef)

  return (
    <div class='tf-number'>
      { props.label &&
        <Label { ...labelProps }>
          { props.label }
        </Label> }
      <div div class='tf-number-field' { ...groupProps }>
        <input { ...inputProps} ref={ inputRef } />
        <div class='tf-number-button-group'>
          <Button type="number" { ...incrementButtonProps }>+</Button>
          <Button type="number" { ...decrementButtonProps }>-</Button>
        </div>
      </div>
      { props.description &&
        <Description { ...descriptionProps }>
          { props.description }
        </Description> }
    </div>
  )
}

export default Number
