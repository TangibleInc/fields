import { useState, createContext, useContext } from 'react'
import { formatValue } from '../format'
import { getLocalTimeZone, today } from '@internationalized/date'
import { initJSON } from '../../../../utils'

/**
 * Context
 * https://react-spectrum.adobe.com/react-aria/Calendar.html#contexts
 */
const CalendarPickerContext = createContext(null)

export const CalendarContextProvider = ({ value, children }) => {
  const values = initJSON( value ) ?? ''
  const dateToday = today(getLocalTimeZone())

  const dateValues = {
    start: formatValue( values.start ?? '', dateToday ),
    end: formatValue( values.end ?? '', dateToday )
  }

  const [ dateValue, setDateValue ] = useState(dateValues)

  return (
    <CalendarPickerContext.Provider
      value={{ dateValue, setDateValue }}
    >
      {children}
    </CalendarPickerContext.Provider>
  )
}

export const useCalendarContext = () => {
  const context = useContext(CalendarPickerContext)
  if (!context) {
    throw new Error('useCalendarContext must be used within a Calendar');
  }
  return context
}
