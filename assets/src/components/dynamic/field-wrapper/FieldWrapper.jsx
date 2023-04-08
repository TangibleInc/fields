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

    const dynamicKey = Object.keys(props.dynamic.getAll())[0] ?? false
    const dynamicValue = props.dynamic.get(dynamicKey)

    return dynamicValue ? dynamicValue.name : ''
  } 
  
  const removePreviousValues = currentKey => {
    for( const key in props.dynamic.getAll() ) {      
      if( currentKey !== key ) props.dynamic.delete(key)
    }
  }

  return(
    <BaseWrapper
      config={ props.dynamic ?? false } 
      onValueSelection={dynamicValue => {
        removePreviousValues(dynamicValue)
        props.dynamic.setMode('replace')
        setIsDynamic(true)
      }}
      remove={{
        isDisabled: isDynamic === false,
        onPress: () => {
          props.dynamic.setMode('none')
          props.dynamic.clear()
          setIsDynamic(false)
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
