import { 
  useState,
  forwardRef 
} from 'react'

import { BaseWrapper } from '../'

/**
 * Props needed:
 * - dynamic: dynamic object from dynamicValuesAPI() in ./dynamic-values/index.js
 * - value: state value from parent field component
 * - onValueSelection: callback from when value is selected, used to set state in parent field component
 * - ref: Ref used by parent field component for input element
 * 
 * Optional:
 * - inputProps: Needed if parent field component require inputProps to be displayed at all time (example: for a label) 
 * - name: Field name, only needed if parent use one 
 * - onValueRemove: Callback when we remove dynamic value
 */
const FieldWrapper = forwardRef(({
  inputProps = {},
  ...props
}, ref) => {
 
  const [isDynamic, setIsDynamic] = useState(
    props.dynamic ? props.dynamic.hasValues() : false
  )
  
  const getLabel = string => {
    const value = props.dynamic.parse(string)
    return value && value.type
      ? props.dynamic.getLabel(value.type)
      : ''
  } 

  return(
    <BaseWrapper
      className="tf-dynamic-field-wrapper"
      config={ props.dynamic ?? false }
      onValueSelection={ dynamicValue => {
        setIsDynamic(true)
        props.onValueSelection(dynamicValue)
      }}
      remove={{
        isDisabled: isDynamic === false,
        onPress: () => {
          setIsDynamic(false)
          if( props.onValueRemove ) props.onValueRemove()
        }
      }}
      buttonType={ props.buttonType ?? 'outside' }
      readOnly={ props.readOnly ?? false }
    >
      { isDynamic
        ? 
          <>
           <input 
              type="text" 
              className="tf-dynamic-value-input" 
              value={ getLabel(props.value) }
              disabled
            />
            <input 
              { ...inputProps }
              name={ props.name ?? '' }
              value={ props.value ?? '' }
              type="hidden" 
              ref={ ref }
            />
          </>
        : props.children }
    </BaseWrapper>
  )
})

export default FieldWrapper
