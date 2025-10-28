import { useRef } from 'react'
import { useDateFieldState } from 'react-stately'
import { createCalendar } from '@internationalized/date'

import { 
  useDateField,
  useLocale 
} from 'react-aria'

import DateSegment from './DateSegment.tsx'

const DateField = props => {
  
  const { locale } = useLocale()
  const state = useDateFieldState({
    ...props,
    locale,
    createCalendar
  })

  const ref = useRef();
  const { fieldProps } = useDateField(props, state, ref)

  return(
    <div className="tf-date-field" { ...fieldProps } ref={ ref }>
      { state.segments.map((segment, i) => (
        <DateSegment key={ i } segment={ segment } state={ state } />
      )) }
    </div>
  )
}

export default DateField
