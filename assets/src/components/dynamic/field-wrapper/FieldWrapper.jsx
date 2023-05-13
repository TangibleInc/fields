import { 
  useState,
  forwardRef 
} from 'react'

import { BaseWrapper } from '../'

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
