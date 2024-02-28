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

export default Preset
