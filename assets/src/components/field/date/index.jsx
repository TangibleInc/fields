import { 
  useState,
  useEffect 
} from 'react'

import { 
  today, 
  getLocalTimeZone,
  CalendarDate
} from '@internationalized/date'

import DatePicker from './DatePicker'

/**
 * Export used when initialized from a php functions, or inside a repeater
 * 
 * @see control-list.js
 */
export default props => {

  const minValue = today(getLocalTimeZone())  
  const [value, setValue] = useState()

  /**
   * Init value on first render
   * 
   * @see https://react-spectrum.adobe.com/internationalized/date/
   */
  useEffect(() => {

    const initialValue = (props.value ?? '').split('-')

    setValue(initialValue.length === 3
      ? new CalendarDate('AD', initialValue[0], initialValue[1], initialValue[2])
      : minValue
    )
  }, [])

  useEffect(() => {
    props.onChange && props.onChange( getStringValue() )
  }, [value])

  const getStringValue = () => (
    value && value.toString ? value.toString() : ''
  ) 

  return(
    <>
      <input type='hidden' name={ props.name ?? '' } value={ getStringValue() } /> 
      <DatePicker
        label={ props.label ?? false }
        description={ props.description ?? false }
        minValue={ minValue }
        value={ value }
        onChange={ setValue }
      />
    </>
  )
}
