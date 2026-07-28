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
   * The field value must be a CalendarDate instance
   * If futureOnly=true and value is in the past, we default to today date
   */
  const isPast = date => hasFutureOnly && date && date.compare(dateToday) < 0

  const currentValue = formatValue(props.value, dateToday)
  const stateValue = isPast(currentValue) ? dateToday : currentValue

  /**
   * @see https://react-spectrum.adobe.com/react-stately/useDatePickerState.html
   */
  const state = useDatePickerState({
    ...props,
    value: stateValue,
    /**
     * react-stately/aria handle the state and make sure any change trigger
     * onChange (keyboard, input, calendar...)
     *
     * Important to not return a past value if not allowed, will trigger an
     * infinite re-render loop otherwise
     */
    onChange: newValue => props.onChange && props.onChange(
      isPast(newValue)
        ? stateValue.toString()
        : ( newValue ? newValue.toString() : '' )
    )
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
        <Label labelProps={ labelProps } parent={ props }>
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
          name={ props.name ?? '' }
          onChange={ setValue }
          state={ state }
          datePickerProps={{
            inputProps,
            ...datePickerProps
          }}
        />
      </FieldWrapper>
      { props.description &&
        <Description descriptionProps={ descriptionProps } parent={ props }>
          { props.description }
        </Description> }
    </div>
  )
 }

 export default Date
