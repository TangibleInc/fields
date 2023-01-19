import { useRef, useEffect } from 'react'
import { useDatePickerState } from 'react-stately'
import {
  useDatePicker,
  useFocus,
  useFocusWithin
} from 'react-aria'

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

  /**
   * We can't use useFocusWithin because it's not working well when nested (the ColorPicker
   * component already implment it)
   *
   * @see https://react-spectrum.adobe.com/react-aria/useFocusWithin.html
   * @see https://stackoverflow.com/a/42234988/10491705
   */
  useEffect(() => {
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [ref])

  const onClickOutside = event => {
    const tempRef = ref.current ?? false

    if ( ! tempRef ) return;
    if ( tempRef.contains(event.target) ) {
      return;
    }

    state.setOpen( false )
  }
  buttonProps.onPress = () => state.setOpen( !state.isOpen )

  return(
    <div class="tf-date">
      { props.label &&
        <Label { ...labelProps }>
          { props.label }
        </Label> }
      <div class="tf-date-field-container">
        <div class="tf-date-group" { ...groupProps } ref={ ref }>
          <DateField { ...fieldProps } />
          <Button type="action" { ...buttonProps }>
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

