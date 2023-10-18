import { 
  useRef, 
  useState,
  useEffect
} from 'react'

import { 
  today, 
  getLocalTimeZone,
  CalendarDate
} from '@internationalized/date'

import { 
  Label,
  Description
} from '../../base'

import { useDatePicker } from 'react-aria'
import { useDatePickerState } from 'react-stately'
import { FieldWrapper } from '../../dynamic'
import { formatValue } from './format'
import DatePicker from './DatePicker'

const Date = props => {

  const [value, setValue] = useState(props.value ?? '')

  useEffect(() => props.onChange && props.onChange(value), [value])
  
  const hasFutureOnly = props.futureOnly && props.futureOnly === true
  const dateToday = today(getLocalTimeZone())
  const minValue = hasFutureOnly 
    ? dateToday 
    : new CalendarDate('AD', '1', '1', '1') 
        
  /**
   * @see https://react-spectrum.adobe.com/react-stately/useDatePickerState.html
   */
  const state = useDatePickerState({
    ...props,
    /**
     * useDatePickerState only accept a CalendarDate instance as a value 
     */
    value: formatValue(props.value, dateToday),
  })

  /**
   * @see https://react-spectrum.adobe.com/react-aria/useDatePicker.html
   */
  const ref = useRef(null)
  const {
    labelProps,
    descriptionProps,
    inputProps,
    ...datePickerProps
  } = useDatePicker({...props, minValue: minValue }, state, ref)
  
  return(
    <div className="tf-date-picker">
      { props.label &&
        <Label { ...labelProps }>
          { props.label }
        </Label> }
      <FieldWrapper 
        { ...props } 
        value={ value }
        onValueSelection={ setValue }
        ref={ ref } 
        inputProps={ datePickerProps.inputProps } 
      >
        <DatePicker
          ref={ ref }
          minValue={ minValue }
          name={ props.name ?? '' }
          value={ formatValue(value) }
          onChange={ setValue }
          onFocusChange={ props.onFocusChange ?? false }
          dynamic={ props.dynamic ?? false }
          hasFutureOnly={ hasFutureOnly }
          state={ state }
          datePickerProps={{ 
            inputProps, 
            ...datePickerProps 
          }}
        />
      </FieldWrapper>
      { props.description &&
        <Description { ...descriptionProps }>
          { props.description }
        </Description> }
    </div>
  )
 }

 export default Date
