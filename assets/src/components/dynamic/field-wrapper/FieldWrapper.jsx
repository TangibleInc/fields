import { useState } from 'react'
import { BaseWrapper } from '../'

const FieldWrapper = ({
  inputProps = {},
  inputRef = false,
  ...props
}) => {
 
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
      config={ props.dynamic ?? false } 
      onValueSelection={ dynamicValue => {
        setIsDynamic(true)
        props.onValueSelection(dynamicValue)
      }}
      remove={{
        isDisabled: isDynamic === false,
        onPress: () => setIsDynamic(false)
      }}
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
              type="hidden" 
              name={ props.name } 
              value={ props.value }
              ref={ inputRef }
            />
          </>
        : props.children }
    </BaseWrapper>
  )
}

export default FieldWrapper
