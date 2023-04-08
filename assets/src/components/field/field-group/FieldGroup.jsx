import { 
  useState,
  useEffect
} from 'react'

import { 
  initJSON, 
  areSameObjects 
} from '../../../utils'

import { applyDependentValues } from '../../../dependent-values' 
import Control from '../../../Control'

/**
 * Display other field and save all values in a single json object 
 */

const FieldGroup = props => {

  const [value, setValue] = useState(
    initJSON(props.value)
  )

  const setAttribute = (name, attributeValue) => {
    setValue({
      ...value,
      [name]: attributeValue
    })
  }

  useEffect(() => props.onChange && props.onChange(value), [value])
  
  useEffect(() => {

    const haveSameSize = Object.keys(props.value).length === Object.keys(value).length
    const haveSameValues = areSameObjects(props.value, value)

    // Avoid inifinte loops, but should find a more sane way
    if( ! haveSameSize || haveSameValues ) return; 
      
    setValue(props.value)
  }, [props.value])

  const fields = props.fields ?? []

  return(
    <div class="tf-field-group">
      <input type='hidden' name={ props.name ?? '' } value={ JSON.stringify(value) } />
      { applyDependentValues(
          props.element ?? false,
          fields,
          value
        ).map(
          control => (
            <div class="tf-field-group-item">
              <Control
                { ...control } 
                value={ value[control.name] ?? '' }
                onChange={ value => setAttribute(control.name, value) }
              />
            </div>  
          )
        )}
    </div>
  )
}

export default FieldGroup
