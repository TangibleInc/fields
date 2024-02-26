import { useDateRangePicker } from 'react-aria'
import { useDateRangePickerState } from 'react-stately'
import DateField from './DateField'
import { Button, Dialog, Popover } from '../../base'
import Calendar from './calendar/Calendar'

const DateRangePicker = ( props ) => {
  const state = useDateRangePickerState(props)
  const ref = React.useRef(null)
  const {
    groupProps,
    startFieldProps,
    endFieldProps,
    buttonProps,
    dialogProps,
    calendarProps
  } = useDateRangePicker( props, state, ref )

  return (
    <div className="tf-date-field-container">
      <div {...groupProps} ref={ref} style={{ display: 'flex' }}>
        <div >
          <DateField {...startFieldProps} />
          <span style={{ padding: '0 4px' }}>–</span>
          <DateField {...endFieldProps} />
          {state.isInvalid &&
            <span aria-hidden="true">🚫</span>}
        </div>
        <Button {...buttonProps}>🗓</Button>
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
}

export default DateRangePicker