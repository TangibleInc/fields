import React, { useState} from 'react';
import { Time } from '@internationalized/date';
import TimeField from './TimeField'
import { Description } from '../../base'

const TimePicker = ( props ) => {

  const convertTime = ( timeString ) => {
    const [hour, minute] = timeString.split(":").map(numString => parseInt(numString))
    return new Time(hour, minute) 
  }

  const hourCycle = parseInt( props.hourCycle) ?? 12

  const [value, setValue] = useState( convertTime( props.value ) )
  
  const minValue = convertTime( props.minValue ?? '00:00' )
  const maxValue = convertTime( props.maxValue ?? '23:59' )

  return(
    <>
      <TimeField
        label={ props.label ?? '' }
        value={ value }
        onChange={ setValue }
        name={ props.name ?? '' }
        hourCycle={ hourCycle }
        minValue={ minValue }
        maxValue={ maxValue }
        />

      {
        props.description &&
         <Description>
            { props.description }
         </Description>
      }

    </>
  )
}

export default TimePicker