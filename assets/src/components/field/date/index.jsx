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


  const dateToday = today( getLocalTimeZone() )
  const noDateLimit = () => {

    dateToday.day = 1
    dateToday.month = 1
    dateToday.year = 1

    return dateToday

  }

  /* 'future_only' => true, Add this to render field (date picker) to enable the future date only */
  const hasFutureOnly = props.future_only && props.future_only === true
  const minValue = hasFutureOnly ? dateToday : props.value ? noDateLimit() : dateToday
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

    if( hasFutureOnly && value && dateToday && props.value ){

      let yearRule = value.year < dateToday.year,
          monthRule = value.year <= dateToday.year && value.month < dateToday.month,
          dayRule = value.year <= dateToday.year && value.month <= dateToday.month && value.day < dateToday.day
      
      if( yearRule || monthRule || dayRule ) 
        setValue(new CalendarDate('AD',
        yearRule ? dateToday.year : value.year,
        monthRule ? dateToday.month : value.month,
        dayRule ? dateToday.day : value.day))

    }

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
        onFocusChange={ props.onFocusChange ?? false }
      />
    </>
  )
}
