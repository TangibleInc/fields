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

  const ref = useRef()
  const state = useColorFieldState(props)
  const {
    labelProps,
    inputProps,
    descriptionProps
  } = useColorField(props, state, ref)

  const [value, setValue] = useState(props.value ?? '')
  useEffect(() => props.onChange && props.onChange(value), [value])

  return(
    <div className="tf-color">
      { props.label &&
        <Label { ...labelProps }>
          { props.label }
        </Label> }
      <FieldWrapper 
        { ...props }
        value={ value } 
        onValueSelection={ dynamicValue => setValue(dynamicValue) }
        inputProps={ inputProps } 
        inputRef={ ref }
      >
        <ColorField 
          { ...props }
          value={ value }
          onChange={ props.onChange }
          state={ state }
          inputProps={ inputProps } 
          colorFieldRef={ ref } 
        />
      </FieldWrapper>
      { props.description &&
        <Description { ...descriptionProps }>
          { props.description }
        </Description> }
    </div>
  )
}

export default Color
