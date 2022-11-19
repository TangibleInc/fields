import { 
  useCalendarGrid, 
  useLocale 
} from 'react-aria'

import { getWeeksInMonth } from '@internationalized/date'
import Cell from './Cell'

/**
 * @see https://react-spectrum.adobe.com/react-aria/useCalendar.html#calendargrid
 */

const CalendarGrid = ({ state, ...props }) => {

  const { locale } = useLocale()
  const { 
    gridProps, 
    headerProps, 
    weekDays 
  } = useCalendarGrid(props, state)

  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale)

  return (
    <table class="tf-calendar-table" { ...gridProps }>
      <thead { ...headerProps }>
        <tr>
          { weekDays.map((day, index) => (
            <th key={ index }>{ day }</th>
          )) }
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map(weekIndex => (
          <tr key={weekIndex}>
            {state.getDatesInWeek(weekIndex).map((date, i) => (
              date
                ? <Cell key={ i } state={ state } date={ date } />
                : <td key={ i } />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CalendarGrid
