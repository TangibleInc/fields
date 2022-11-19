import { useRef } from 'react'
import { useCalendarState } from 'react-stately'
import { createCalendar } from '@internationalized/date'
import { Button } from '../../../base'

import { 
  useCalendar, 
  useLocale 
} from 'react-aria'

import Grid from './Grid'

/**
 * @see https://react-spectrum.adobe.com/react-aria/useCalendar.html#example
 */

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
        <div class="tf-calendar-month">
          <strong>
            { title }
          </strong>
        </div>
        <div class="tf-calendar-buttons">
          <Button { ...prevButtonProps }>&lt;</Button>
          <Button { ...nextButtonProps }>&gt;</Button>
        </div>
      </div>
      <Grid state={ state } />
    </div>
  )
}

export default Calendar
