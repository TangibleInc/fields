import { useState, useEffect } from 'react';
import { Time } from '@internationalized/date';
import TimeField from './TimeField'

const TimePicker = (props) => {

  const convertTime = (timeString) => {
    if (!timeString || typeof timeString !== 'string') return new Time(0, 0);
    if (timeString instanceof Time) return timeString
    const [hour, minute] = timeString.split(":").map(numString => parseInt(numString))
    return new Time(hour, minute)
  }

  const hourCycle = parseInt(props.hourCycle) ?? 12

  const [value, setValue] = useState(convertTime(props.value))

  const minValue = convertTime(props.minValue ?? '00:00')
  const maxValue = convertTime(props.maxValue ?? '23:59')

  useEffect(() => {
    if (convertTime(props.value).toString() !== value.toString()) setValue(props.value)
  }, [props.value])

  useEffect(() => {
    if (value.toString() !== props.value.toString()) {
      props.onChange?.(value.toString());
    }
  }, [value]);

  return (
    <>
      <div className="tf-time-picker">
        <input type="hidden" name={props.name ?? ''} value={value} />
        <TimeField
          label={props.label ?? ''}
          description={props.description ?? ''}
          labelVisuallyHidden={props.labelVisuallyHidden}
          descriptionVisuallyHidden={props.descriptionVisuallyHidden}
          value={value}
          onChange={setValue}
          name={props.name ?? ''}
          hourCycle={hourCycle}
          minValue={minValue}
          maxValue={maxValue}
        />
      </div>
    </>
  )
}

export default TimePicker
