import { 
  today, 
  getLocalTimeZone,
  startOfMonth,
  endOfMonth
} from '@internationalized/date'

import { Button } from '../../../base'
import { useCalendarContext } from './DateRangeCalendarContext'

/**
 * Preset
 * https://react-spectrum.adobe.com/react-aria/Calendar.html#contexts
 */
const Preset = ({ date, children }) => {
    const { setDateValue } = useCalendarContext()

    const onPress = () => {
      setDateValue(date)
    }

    return <Button onPress={onPress}>{children}</Button>
}

const DateRangePresets = () => {
  const dateToday = today(getLocalTimeZone())

  return(
    <>
      <Preset date={{ start:dateToday, end: dateToday }} >Today</Preset>
      <Preset date={{ start: dateToday.subtract({weeks:1}), end: dateToday }} >Last Week</Preset>
      <Preset date={{ start: startOfMonth(dateToday), end: endOfMonth(dateToday) }} >This Month</Preset>
      <Preset date={{ start: startOfMonth(dateToday.subtract({months:1})), end: endOfMonth( dateToday.subtract({months:1})) }} >Last Month</Preset>
    </>
   )
}

export default DateRangePresets