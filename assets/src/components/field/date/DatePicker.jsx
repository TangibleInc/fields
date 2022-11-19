import { useRef } from 'react'
import { useDatePicker } from 'react-aria'
import { useDatePickerState } from 'react-stately'

import { 
  today, 
  getLocalTimeZone 
} from "@internationalized/date";

import {
  Button,
  Popover,
  Label,
  Description
} from '../../base'

import Field from './Field'
import Calendar from './calendar/Calendar'

/**
 * @see https://react-spectrum.adobe.com/react-aria/useDatePicker.html
 */

const DatePicker = props => {
  
  console.log(props)

  console.log({ 
    ...props,
    value: today(getLocalTimeZone())
  })

  const state = useDatePickerState({
    ...props,
    value: today(getLocalTimeZone())
  })
  const ref = useRef()
  
  const {
    groupProps,
    labelProps,
    fieldProps,
    buttonProps,
    dialogProps,
    calendarProps,
    descriptionProps
  } = useDatePicker(props, state, ref)

  return (
    <div class="tf-date">
      { props.label &&
        <Label { ...labelProps }>
          { props.label }
        </Label> }
      <div class="tf-date-field-container">
        <div class="tf-date-group" { ...groupProps } ref={ ref }>
          <Field { ...fieldProps } /> 
          <Button type="action" { ...buttonProps }>🗓</Button>
        </div>
        { state.isOpen &&
          <Popover state={ state } ref={ ref } { ...dialogProps } placement="bottom start">
            <Calendar { ...calendarProps } />
          </Popover> }
      </div>
      { props.description &&
        <Description { ...descriptionProps }>
          { props.description }
        </Description> }
    </div>
  )
}

export default DatePicker
