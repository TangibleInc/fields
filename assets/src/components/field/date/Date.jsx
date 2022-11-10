import { useRef } from 'react'
import { useDateFieldState } from 'react-stately'
import { createCalendar } from '@internationalized/date'

import { 
  useDateField, 
  useLocale 
} from 'react-aria'

import { Label } from '../../base'
import Segment from './Segment'

/**
 * @see https://react-spectrum.adobe.com/react-aria/useDateField.html 
 */

const Date = props => {

  const { locale } = useLocale()

  const propsWithDefault = { 
    defaultValue: props.defaultValue ?? '', 
    ...props 
  }
  const state = useDateFieldState({
    propsWithDefault,
    locale,
    createCalendar
  })

  const ref = useRef()
  const { 
    labelProps, 
    fieldProps,
    descriptionProps
  } = useDateField(props, state, ref)

  return (
    <div class="tf-date">
      { props.label &&
        <Label { ...labelProps }>
          { props.label }
        </Label> }
      <div class="tf-date-field" { ...fieldProps } ref={ ref }>
        { state.segments.map((segment, i) => (
          <Segment key={ i } segment={ segment } state={ state } />
        )) }
        { state.validationState === 'invalid' &&
          <span aria-hidden="true">
            🚫
          </span> }
      </div>
    </div>
  )
}

export default Date
