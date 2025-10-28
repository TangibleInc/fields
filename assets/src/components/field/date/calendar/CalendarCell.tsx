import { useRef } from 'react'

import {
  useCalendarCell,
  useFocusRing,
  mergeProps
} from 'react-aria'

const CalendarCell = ({ state, date }) => {

  const ref = useRef()
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    isUnavailable,
    formattedDate
  } = useCalendarCell({ date }, state, ref)

  const { focusProps } = useFocusRing()

  let classes = 'tf-calendar-cell'
  if( isSelected ) classes += ' ' + 'tf-calendar-cell-selected' 
  if( isDisabled ) classes += ' ' + 'tf-calendar-cell-disabled' 
  if( isUnavailable ) classes += ' ' + 'tf-calendar-cell-unavailable'

  return(
    <td { ...cellProps }>
      <div
        { ...mergeProps(buttonProps, focusProps) }
        ref={ ref }
        hidden={ isOutsideVisibleRange }
        className={ classes }
      >
        { formattedDate }
      </div>
    </td>
  )
}

export default CalendarCell
