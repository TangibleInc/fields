import { 
  useState,
  useEffect,
  useContext,
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
   * Not sure why, but without a ref the state value is always empty when used inside getValue()
   */
  const valueRef = useRef()
  valueRef.current = value

  const { ControlContext } = tangibleFields 
  const context = useContext(ControlContext)

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

  const hasField = name => (
    fields.map(
      field => field.name ?? false
    ).includes(name)
  )

  return(
    <div className="tf-field-group">
      <input type='hidden' name={ props.name ?? '' } value={ JSON.stringify(value) } />
      { applyDependentValues(
          props.element ?? false,
          fields, 
          value
        ).map(
          (control, index) => (
            <div key={ index } className="tf-field-group-item">
              <Control
                { ...control }
                value={ value[control.name] ?? '' }
                controlType={ 'subfield' }
                onChange={ value => setAttribute(control.name, value) }
                visibility={{
                  condition: control.condition?.condition ?? false,
                  action: control.condition?.action ?? 'show',
                  /**
                   * The field value can either be from a subvalue or from another field value
                   */
                  getValue: name => (
                    hasField(name)
                      ? (valueRef.current[name] ?? '')
                      : (context.getValue(name) ?? '')
                  ),
                  /**
                   * Needed to trigger a re-evaluatation of the visibility conditions according when a 
                   * subfield value change
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
