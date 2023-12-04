import { useRef } from 'react'
import { useCalendarState } from 'react-stately'
import { createCalendar } from '@internationalized/date'

import { 
  useCalendar, 
  useLocale 
} from 'react-aria'

import { Button } from '../../../base'
import CalendarGrid from './CalendarGrid'

const Calendar = props => {

  const { locale } = useLocale()
  const state = useCalendarState({
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
  } = useCalendar(
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
      <CalendarGrid state={ state } />
    </div>
  )
}

export default Calendar
