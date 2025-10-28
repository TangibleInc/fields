import {
  useRef,
  useState,
  useEffect
} from 'react'

import { useColorField } from '@react-aria/color'
import { useColorFieldState } from '@react-stately/color'
import { FieldWrapper } from '../../dynamic/'

import {
  Description,
  Label
} from '../../base'

import ColorField from './ColorField'

/**
 * @see https://react-spectrum.adobe.com/react-aria/useColorField.html
 */

const Color = props =>{

  /**
   * If value is initially unset or empty, components will change from uncontrolled to
   * controlled when the value will change and it will throw a warning
   *
   * To avoid any issues, we use #FFFFFF as a default value
   */
  let propertyValue
  if ( typeof props.value === 'object' ) {
    propertyValue = props.value?.value || '#FFFFFF'
  } else {
    propertyValue = props?.value || '#FFFFFF'
  }

  const formatedProps = ({
    ...props,
    value: propertyValue
  })

  const ref = useRef()
  const state = useColorFieldState(formatedProps)
  const {
    labelProps,
    inputProps,
    descriptionProps
  } = useColorField(formatedProps, state, ref)

  const [value, setValue] = useState(formatedProps.value ?? '')
  useEffect(() => props.onChange && props.onChange(value), [value])

  return(
    <div className="tf-color">
      { props.label &&
        <Label labelProps={ labelProps } parent={ props }>
          { props.label }
        </Label> }
      <FieldWrapper
        { ...formatedProps }
        value={ value }
        onValueSelection={ setValue }
        inputProps={ inputProps }
        ref={ ref }
      >
        <ColorField
          { ...formatedProps }
          value={ value }
          onChange={ props.onChange }
          state={ state }
          inputProps={ inputProps }
          ref={ ref }
        />
      </FieldWrapper>
      { props.description &&
        <Description descriptionProps={ descriptionProps } parent={ props }>
          { props.description }
        </Description> }
    </div>
  )
}

export default Color
