import {
  useEffect,
  forwardRef
} from 'react'

import { 
  Button, 
  Dialog,
  Popover
} from '../../base'

import Calendar from './calendar/Calendar'
import DateField from './DateField'

/**
 * @see https://codesandbox.io/s/reverent-faraday-5nwk87?file=/src/DatePicker.js
 */

const DatePicker = forwardRef(({
  datePickerProps,
  state,
  ...props
}, ref) => {
  
  const {
    groupProps,
    fieldProps,
    buttonProps,
    dialogProps,
    calendarProps,
    inputProps
  } = datePickerProps

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
    /**
     * The calendar popover is portaled outside the ref — without this,
     * clicking a date or navigating months closes the calendar
     */
    if ( event.target.closest('.tf-popover') ) {
      return;
    }

    state.setOpen( false )
  }
  buttonProps.onPress = () => state.setOpen( !state.isOpen )

  const getStringValue = () => (
    state.value && state.value.toString ? state.value.toString() : ''
  )

  useEffect(() => {
    props.onChange && props.onChange( getStringValue() )
  }, [state.value])

  return(
    <div className="tf-date-field-container">
      <input { ...inputProps } type='hidden' name={ props.name ?? '' } value={ getStringValue() } /> 
      <div className="tf-date-group" { ...groupProps } ref={ ref }>
        <DateField { ...fieldProps } />
        <Button type="action" { ...buttonProps }>
          🗓
        </Button>
      </div>
      { state.isOpen &&
        <Popover state={state} triggerRef={ref} placement="bottom start">
          <Dialog {...dialogProps}>
            <Calendar {...calendarProps} />
          </Dialog>
        </Popover> }
    </div>
  )
})

export default DatePicker

