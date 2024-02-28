import { 
  useCalendarGrid, 
  useLocale 
} from 'react-aria'

import { 
  getWeeksInMonth, 
  endOfMonth 
} from '@internationalized/date'

import CalendarCell from './CalendarCell'

const CalendarGrid = ({ state, ...props}) => {
  const { locale } = useLocale()
  const isDateRange = props.dateRange ?? false

  const startDate = state.visibleRange.start.add(props.offset ?? {})
  const endDate = endOfMonth(startDate)

  const { gridProps, headerProps, weekDays } = isDateRange 
  ? useCalendarGrid(
    {
      startDate,
      endDate
    },
    state ) 
  : useCalendarGrid(
    props,
    state
  )

  // Get the number of weeks in the month so we can render the proper number of rows
  const weeksInMonth = getWeeksInMonth(isDateRange ? startDate : state.visibleRange.start, locale)
  
  return(
    <table className="tf-calendar-table" { ...gridProps }>
      <thead { ...headerProps }>
        <tr>
          { weekDays.map((day, index) => (
            <th key={ index }>{ day }</th>
          )) }
        </tr>
      </thead>
      <tbody>
        { [...new Array(weeksInMonth).keys()].map((weekIndex) => {
          const datesInWeek = isDateRange ? [weekIndex, startDate] : [weekIndex]
          return ( <tr key={ weekIndex }>
            { state
              .getDatesInWeek(...datesInWeek)
              .map((date, i) => date 
                ? ( <CalendarCell key={ i } state={ state } date={ date } currentMonth={ startDate } /> )
                : ( <td key={ i } /> )
              ) }
          </tr> )
        })}
      </tbody>
    </table>
  )
}

export default CalendarGrid
