import { useRef } from 'react'
import { useCalendarState } from 'react-stately'
import { useVisuallyHidden } from 'react-stately'
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
    <div class="tf-calendar" { ...calendarProps } ref={ ref }>
       <div class="tf-calendar-header">
        <div class="tf-calendar-buttons">
          <Button { ...prevButtonProps }>&lt;</Button>
          <div class="tf-calendar-month">
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
