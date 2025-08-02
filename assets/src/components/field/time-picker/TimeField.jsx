import { useLocale, useTimeField } from 'react-aria';
import { useTimeFieldState } from 'react-stately';
import { useRef } from 'react';
import DateSegment from '../date/DateSegment';
import { Description, Label } from '../../base/';
import { Time } from '@internationalized/date';

const TimeField = (props) => {

  const { locale } = useLocale();

  const state = useTimeFieldState({
    ...props,
    value: props.value,
    onChange: (newVal) => {
      const { hour, minute, second } = newVal
      props.onChange?.(new Time(hour, minute, second))
    },
    locale,
    minValue: props.minValue,
    maxValue: props.maxValue
  });

  const ref = useRef();

  const { labelProps, descriptionProps, fieldProps, inputProps } = useTimeField(props, state, ref);

  return (
    <div className="tf-time-wrapper">
      {props.label &&
        <Label labelProps={labelProps} parent={props}>
          {props.label}
        </Label>
      }
      <div {...fieldProps} className="tf-time-field">
        {state.segments.map((segment, i) => (
          <DateSegment key={i} segment={segment} state={state} />
        ))}
        {state.isInvalid &&
          <span aria-hidden="true">🚫</span>}
      </div>
      {
        props.description &&
        <Description descriptionProps={descriptionProps} parent={props}>
          {props.description}
        </Description>
      }
    </div>
  );
}

export default TimeField
