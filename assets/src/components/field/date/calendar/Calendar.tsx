import { 
  useCalendar, 
  useLocale, 
  useRangeCalendar
} from 'react-aria'

import { useRef } from 'react'
import { useCalendarState, useRangeCalendarState } from 'react-stately'
import { createCalendar } from '@internationalized/date'
import { Button } from '../../../base'
import { useCalendarContext } from './DateRangeCalendarContext'
import CalendarGrid from './CalendarGrid'
import DateRangePresets from './Preset'

const Calendar = props => {

  const { locale } = useLocale()

  const { dateValue } = props.dateRange ? useCalendarContext() : {}

    const state = props.dateRange 
    ? useRangeCalendarState({
        ...props,
        value: dateValue,
        locale,
        visibleDuration: { months: props.multiMonth },
        createCalendar }) 
    : useCalendarState({
        ...props,
        locale,
        createCalendar
    })

  const ref = useRef()
  const { 
    calendarProps, 
    prevButtonProps,
    nextButtonProps,
    title
  } = props.dateRange 
  ? useRangeCalendar (
      props,
      state,
      ref )
  : useCalendar(
      props,
      state,
      ref
  )

  return(
      <div className="tf-calendar" { ...calendarProps } ref={ ref }>
        <div className="tf-calendar-header">
          <div className="tf-calendar-buttons">
            <Button { ...prevButtonProps }>&lt;</Button>
            <div className="tf-calendar-month">
              { title }
            </div>
            <Button { ...nextButtonProps }>&gt;</Button>
          </div>
        </div>
        <div className="tf-calendar-tables">
          { 
            ( props.multiMonth === 1 || !props.dateRange ) 
            ? <CalendarGrid state={state} />
            : Array.from({ length: props.multiMonth }, (_, index) => (
                  <CalendarGrid
                    key={index }
                    state={state}
                    dateRange={props.dateRange}
                    offset={{ months: index }}
                  />
              )) 
          }
        </div>
        {
            ( props.dateRange && props.datePresets ) && (
              <div className="tf-calendar-presets">
                <DateRangePresets />
              </div>
            )
        }
      </div>
  )
}

export default Calendar
