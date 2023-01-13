import { 
  useState,
  useEffect
} from 'react'

import { applyDynamicValues } from '../../../dynamic' 
import { initJSON } from '../../../utils'

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

  const fields = props.fields ?? []

  return(
    <div class="tf-field-group">
      <input type='hidden' name={ props.name ?? '' } value={ JSON.stringify(value) } />
      { applyDynamicValues(
          props.element ?? false,
          fields,
          value
        ).map(
          control => ( 
            <div class="tf-field-group-item">
              <Control 
                value={ value[control.name] ?? '' }
                onChange={ value => setAttribute(control.name, value) }
                { ...control }
              />
            </div>  
          )
        )}
    </div>
  )
}

export default FieldGroup
