import { useLocale, useTimeField } from 'react-aria';
import { useTimeFieldState } from 'react-stately';
import React, { useRef } from 'react';
import DateSegment from '../date/DateSegment';
import { Description, Label } from '../../base/';

const TimeField = (props) => {

  const { locale } = useLocale();

  const state = useTimeFieldState({
    ...props,
    locale
  });

  const ref = useRef();

  const { labelProps, descriptionProps, fieldProps } = useTimeField(props, state, ref);

  return (
    <div className="tf-time-wrapper">
      {props.label &&
        <Label labelProps={labelProps} parent={props}>
          {props.label}
        </Label>
      }
      <input type="hidden" name={props.name ?? ''} value={props.value} />
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
