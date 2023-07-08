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

const NumberComponent = props => {

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

  const hasButtons = props.hasButtons ?? true
  
  return (
    <div className='tf-number'>
      { props.label &&
        <Label { ...labelProps }>
          { props.label }
        </Label> }
      <div className='tf-number-field' { ...groupProps }>
        <input { ...inputProps} value={ Number.isInteger(state.numberValue) ? state.numberValue : 0 } ref={ inputRef } />
        { hasButtons && <div className='tf-number-button-group'> 
          <Button type="number" { ...incrementButtonProps }>+</Button> 
          <Button type="number" { ...decrementButtonProps }>-</Button>
        </div> }
      </div>
      { props.description &&
        <Description { ...descriptionProps }>
          { props.description }
        </Description> }
    </div>
  )
}

export default NumberComponent
