import { useRef } from 'react'
import { useDatePickerState } from 'react-stately'
import { useDatePicker } from 'react-aria'

import { 
  Button, 
  Popover, 
  Label,
  Description
} from '../../base'

import Calendar from './calendar/Calendar'
import DateField from './DateField'

/**
 * @see https://codesandbox.io/s/reverent-faraday-5nwk87?file=/src/DatePicker.js
 */

const DatePicker = props => {
  
  const state = useDatePickerState(props)
  const ref = useRef()

  const {
    groupProps,
    labelProps,
    descriptionProps,
    fieldProps,
    buttonProps,
    dialogProps,
    calendarProps
  } = useDatePicker(props, state, ref)

  return(
    <div class="tf-date">
      { props.label &&
        <Label { ...labelProps }>
          { props.label }
        </Label> }
      <div class="tf-date-field-container">
        <div class="tf-date-group" { ...groupProps } ref={ ref }>
          <DateField { ...fieldProps } /> 
          <Button type="action" { ...buttonProps } isPressed={ state.isOpen }>
            🗓
          </Button>
        </div>
        { state.isOpen &&
          <Popover { ...dialogProps } ref={ ref } state={ state } placement="bottom start">
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

