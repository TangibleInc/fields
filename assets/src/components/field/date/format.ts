import { CalendarDate } from '@internationalized/date'

/**
 * @see https://react-spectrum.adobe.com/internationalized/date/
 */
const formatValue = (value, minDate) => {
  
  if( value instanceof CalendarDate) return value
  const initialValue = String(value ?? '').split('-')

  return initialValue.length === 3
    ? new CalendarDate('AD', initialValue[0], initialValue[1], initialValue[2])
    : minDate
}

export {
  formatValue
}
