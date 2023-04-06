import { 
  useState, 
  useEffect 
} from 'react'

import { VisuallyHidden } from 'react-aria'
import { BaseWrapper } from '../'
import { isDynamicValue } from '../utils'

const FieldWrapper = props => {
 
  const [isDynamic, setIsDynamic] = useState(
    props.dynamic ? props.dynamic.hasDynamicValues() : false
  )
  
  const getLabel = () => {

    const value = props.value ?? ''

    return isDynamicValue(value)
      ? (props.dynamic.get()[ value.slice(2, -2) ]?.name ?? value) 
      : value 
  } 
  
  const removePreviousValues = currentKey => {
    for( const key in props.dynamic.get() ) {      
      if( currentKey !== key ) props.dynamic.delete(key)
    }
  }

  return(
    <BaseWrapper
      config={ props.dynamic ?? false } 
      onValueSelection={dynamicValue => {
        removePreviousValues(dynamicValue)
        props.onChange(`[[${dynamicValue}]]`)
        setIsDynamic(true)
      }}
      remove={{
        isDisabled: isDynamic === false,
        onPress: () => {
          props.reset('')
          setIsDynamic(false)
          props.dynamic.clear()
        }
      }}
    >
      { isDynamic
        ? 
          <>
            <input type="text" value={ getLabel() } disabled />
            <VisuallyHidden>
              { props.children }
            </VisuallyHidden>
          </>
        : props.children }
    </BaseWrapper>
  )
}

export default FieldWrapper
