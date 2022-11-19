import { useRef } from 'react'
import { createCalendar } from '@internationalized/date'
import { useDateFieldState } from 'react-stately'

import { 
  useDateField, 
  useLocale 
} from 'react-aria'

import Segment from './Segment'

/**
 * @see https://react-spectrum.adobe.com/react-aria/useDateField.html 
 */

const Field = props => {

  const { locale } = useLocale()

  const propsWithDefault = { 
    defaultValue: props.value ?? '', 
    ...props 
  }
  const state = useDateFieldState({
    propsWithDefault,
    locale,
    createCalendar
  })

  const ref = useRef()
  const { fieldProps } = useDateField(props, state, ref)

  const returnedValue = state.value 
    ? `${state.value.year}-${state.value.month}-${state.value.day}`
    : ''

  return (
    <>
      <input type='hidden' name={ props.name ?? '' } value={ returnedValue } /> 
      <div class="tf-date-field" { ...fieldProps } ref={ ref }>
        { state.segments.map((segment, i) => (
          <Segment key={ i } segment={ segment } state={ state } />
        )) }
        { state.validationState === 'invalid' &&
          <span aria-hidden="true">
            🚫
          </span> }
      </div>
    </>
  )
}

export default Field
// export default props => {

//   const [value, setValue] = useState(
//     props.value && props.value !== ''
//       ? parseDate(props.value)
//       : ''
//   )

//   console.log(props.value)
//   return(
//     <Field
//       label={ props.label ?? false }
//       description={ props.description ?? false }
//       name={ props.name ?? '' }
//       value={ value }
//       onChange={ (stringValue, value) => {
//         setValue(value)
//         props.onChange(stringValue)
//       } } 
//     />
//   )
// }
