import { 
  useCalendarGrid, 
  useLocale 
} from 'react-aria'

import { getWeeksInMonth } from '@internationalized/date'
import CalendarCell from './CalendarCell'

const CalendarGrid = ({ state, ...props }) => {

  const { locale } = useLocale()
  const { gridProps, headerProps, weekDays } = useCalendarGrid(props, state)

  // Get the number of weeks in the month so we can render the proper number of rows
  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale)

  return(
    <table class="tf-calendar-table" { ...gridProps }>
      <thead { ...headerProps }>
        <tr>
          { weekDays.map((day, index) => (
            <th key={ index }>{ day }</th>
          )) }
        </tr>
      </thead>
      <tbody>
        { [...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={ weekIndex }>
            { state
              .getDatesInWeek(weekIndex)
              .map((date, i) => date 
                ? <CalendarCell key={ i } state={ state } date={ date } />
                : <td key={ i } />
              ) }
          </tr>
        )) }
      </tbody>
    </table>
  )
}

export default CalendarGrid
