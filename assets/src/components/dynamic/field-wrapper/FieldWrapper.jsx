import { useState } from 'react'
import { VisuallyHidden } from 'react-aria'
import { BaseWrapper } from '../'

const FieldWrapper = props => {
 
  const [isDynamic, setIsDynamic] = useState(
    props.dynamic ? props.dynamic.hasValues() : false
  )
  
  const getLabel = () => {
    const value = props.dynamic.getAll()[0]
    return value && value.type
      ? props.dynamic.getLabel(value.type)
      : ''
  } 

  return(
    <BaseWrapper
      config={ props.dynamic ?? false } 
      onValueSelection={ dynamicValue => setIsDynamic(true) }
      remove={{
        isDisabled: isDynamic === false,
        onPress: () => setIsDynamic(false)
      }}
    >
      { isDynamic
        ? 
          <>
            <input type="text" class="tf-dynamic-value-input" value={ getLabel() } disabled />
            <VisuallyHidden>
              { props.children }
            </VisuallyHidden>
          </>
        : props.children }
    </BaseWrapper>
  )
}

export default FieldWrapper
