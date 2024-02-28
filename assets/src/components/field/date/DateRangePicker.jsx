import { 
  forwardRef,
  useState,
  useEffect
} from 'react'

import { useDateRangePicker } from 'react-aria'
import { Button, Dialog, Popover } from '../../base'
import { useCalendarContext } from './calendar/DateRangeCalendarContext'
import DateField from './DateField'
import Calendar from './calendar/Calendar'

const DateRangePicker = forwardRef(({
  dateRangePickerProps,
  state,
  ...props
}, ref) => {

  const { dateValue } = useCalendarContext()

  const [focusedDate, setFocusedDate] = useState( dateValue.start )

  /**
     * Make sure focused date is updated when value from input changes
     * 
     * @see https://react-spectrum.adobe.com/react-aria/useCalendar.html#controlling-the-focused-date
     */
  useEffect(() => {
    if( props.value !== focusedDate ) setFocusedDate(props.value.start) // focus only on the start
  }, [props.value])

  const {
    groupProps,
    startFieldProps,
    endFieldProps,
    buttonProps,
    dialogProps,
    calendarProps,
    inputProps,
  } = useDateRangePicker( props, state, ref )

  const getStringValue = () => (
    (state.value && state.value.start && state.value.end) 
    ? JSON.stringify({
      start: state.value.start.toString(),
      end: state.value.end.toString()
    }) 
    : ''
  )

  return (
    <div className="tf-date-field-container">
      <input { ...inputProps } type='hidden' name={ props.name ?? '' } value={ getStringValue() }  />
      <div {...groupProps} ref={ref} className='tf-date-group'>
          <DateField {...startFieldProps} />
          <span style={{ padding: '0 4px' }}>–</span>
          <DateField {...endFieldProps} />
          {state.isInvalid &&
            <span aria-hidden="true">🚫</span>}
        <Button type="action" { ...buttonProps }>
          🗓
        </Button>
      </div>
      {state.isOpen &&
        (
          <Popover state={state} triggerRef={ref} placement="bottom start">
            <Dialog {...dialogProps}>
              <Calendar
                {...calendarProps }
                dateRange={ true }
                datePresets={ props.datePresets ?? false }
                pageBehavior="single"
                multiMonth={ props.multiMonth }
                focusedValue={focusedDate}
                onFocusChange={setFocusedDate}
              />
            </Dialog>
          </Popover>
        )}
    </div>
  )
})

export default DateRangePicker