import {
  useRef,
  useMemo,
  useState,
  useEffect
} from 'react'

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

const NumberComponent = props => {

  const { locale } = useLocale()
  const [value, setValue] = useState(props.value ?? '')

  const defaultFormatOptions = useMemo(() => ({ maximumFractionDigits: 10, useGrouping: false }), [])
  const formatOptions = props.formatOptions ?? defaultFormatOptions
  const state = useNumberFieldState({ ...props, formatOptions, locale })
  const inputRef = useRef()

  const {
    labelProps,
    descriptionProps,
    groupProps,
    inputProps,
    incrementButtonProps,
    decrementButtonProps
  } = useNumberField({ ...props, formatOptions }, state, inputRef)

  useEffect(() => props.onChange && props.onChange(value), [value])

  const hasButtons = props.hasButtons ?? true
  const isDisabled = props.readOnly ?? false

  return(
    <div className='tf-number' data-enabled={ ! props.readOnly }>
      { props.label &&
        <Label labelProps={ labelProps } parent={ props }>
          { props.label }
        </Label> }
      <div className='tf-number-field' { ...groupProps }>
        <FieldWrapper 
          { ...props } 
          value={ value }
          onValueSelection={ setValue }
          ref={ inputRef } 
          inputProps={ inputProps }
        >
          <input
            { ...inputProps}
            step={ props.step ?? 1 }
            ref={ inputRef }
            name={ props.name ?? '' }
            disabled={ isDisabled }
          />
          { hasButtons && <div className='tf-number-button-group'>
            <Button type="number" { ...incrementButtonProps } isDisabled={ isDisabled }>+</Button>
            <Button type="number" { ...decrementButtonProps } isDisabled={ isDisabled }>-</Button>
          </div> }
        </FieldWrapper>
      </div>
      { props.description &&
        <Description descriptionProps={ descriptionProps } parent={ props }>
          { props.description }
        </Description> }
    </div>
  )
}

export default NumberComponent
