import { 
  forwardRef
} from 'react'
import { useDateRangePicker } from 'react-aria'
import { Button, Dialog, Popover } from '../../base'
import DateField from './DateField'
import Calendar from './calendar/Calendar'

const DateRangePicker = forwardRef(({
  dateRangePickerProps,
  state,
  ...props
}, ref) => {

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
    (state.value && state.value.start && state.value.end) ? JSON.stringify({
      start: state.value.start.toString(),
      end: state.value.end.toString()
    }) : ''
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
              <Calendar {...calendarProps } dateRange={ true } />
            </Dialog>
          </Popover>
        )}
    </div>
  )
})

export default DateRangePicker