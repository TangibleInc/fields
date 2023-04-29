import { 
  useState,
  useEffect,
  useRef
} from 'react'

import { 
  initJSON, 
  areSameObjects 
} from '../../../utils'

import { applyDependentValues } from '../../../dependent' 
import Control from '../../../Control'

/**
 * Display other field and save all values in a single json object 
 */
const FieldGroup = props => {

  const [visibilityCallback, setVisibilityCallback] = useState(false)
  const [fieldUpdateCallback, setFieldUpdateCallback] = useState(false)

  const [value, setValue] = useState(
    initJSON(props.value ?? '')
  )

  /**
   * Not sure why, but without a ref value state is always empty when used inside getValue()
   */
  const valueRef = useRef()
  valueRef.current = value

  const setAttribute = (name, attributeValue) => { 
    
    setValue({
      ...value,
      [name]: attributeValue
    })

    if( ! visibilityCallback ) return;

    /**
     * Save the callback to use it in the useEffect so that it's executed
     * after state update 
     */
    setFieldUpdateCallback(() => 
      () => visibilityCallback(name)
    )
  }

  useEffect(() => {
    
    props.onChange && props.onChange(value)
    
    if( ! fieldUpdateCallback ) return;
    
    fieldUpdateCallback()
    setFieldUpdateCallback(false)
  }, [value])
  
  useEffect(() => {

    if( typeof props.value !== 'object' ) return;

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
          (control, index) => (
            <div key={ index } class="tf-field-group-item">
              <Control
                { ...control }
                value={ value[control.name] ?? '' }
                onChange={ value => setAttribute(control.name, value) }
                visibility={{
                  condition: control.condition?.condition ?? false,
                  action: control.condition?.action ?? 'show',
                  /**
                   * Needed to get other field value when evaluatating conditions
                   */
                  getValue: name => (valueRef.current[name]),
                  /**
                   * Needed to trigger a re-evaluatation of the visibility conditions according
                   * to another field value change
                   */
                  watcher: evaluationCallback => {
                    setVisibilityCallback(() => (name) => evaluationCallback(name) )
                  }
                }}
              />
            </div>  
          )
        )}
    </div>
  )
}

export default FieldGroup
