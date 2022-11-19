import { useRef } from 'react'
import { useCalendarCell } from 'react-aria'

/**
 * @see https://react-spectrum.adobe.com/react-aria/useCalendar.html#calendarcell
 */

const Cell = ({ state, date }) => {

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

  return (
    <td { ...cellProps }>
      <div
        { ...buttonProps }
        ref={ ref }
        hidden={ isOutsideVisibleRange }
        className={`tf-calendar-cell ${isSelected ? 'tf-calendar-cell-selected' : ''} ${
          isDisabled ? 'tf-calendar-cell-disabled' : ''
        } ${isUnavailable ? 'tf-calendar-cell-unavailable' : ''}`}
      >
        { formattedDate }
      </div>
    </td>
  )
}

export default Cell

