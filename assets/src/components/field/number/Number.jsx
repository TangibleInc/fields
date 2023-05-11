import { useRef } from 'react'
import { useNumberFieldState } from 'react-stately'
import { FieldWrapper } from '../../dynamic'

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

  const hasButtons = props.hasButtons ?? true

  return(
    <div className='tf-number'>
      { props.label &&
        <Label { ...labelProps }>
          { props.label }
        </Label> }
      <div className='tf-number-field' { ...groupProps }>
        <FieldWrapper { ...props }>
          <input { ...inputProps} ref={ inputRef } />
          { hasButtons && <div className='tf-number-button-group'>
            <Button type="number" { ...incrementButtonProps }>+</Button>
            <Button type="number" { ...decrementButtonProps }>-</Button>
          </div> }
        </FieldWrapper>
      </div>
      { props.description &&
        <Description { ...descriptionProps }>
          { props.description }
        </Description> }
    </div>
  )
}

export default Number
