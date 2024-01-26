import { 
  useState,
  useEffect,
  useRef
} from 'react'

import { initJSON } from '../../../utils'
import Control from '../../../Control'
import Element from '../../../Element'

/**
 * Display other field and save all values in a single json object 
 */
const FieldGroup = props => {

  const [onChangeCallback, setChangeCallback] = useState(false)
  const [fieldUpdateCallback, setFieldUpdateCallback] = useState(false)

  const [value, setValue] = useState(
    initJSON(props.value ?? '')
  )

  /**
   * Not sure why, but without a ref the state value is always empty when used inside getValue()
   */
  const valueRef = useRef()
  valueRef.current = value

  const setAttribute = (name, attributeValue) => { 
    
    setValue({
      ...value,
      [name]: attributeValue
    })

    if( ! onChangeCallback ) return;

    /**
     * Save the callback to use it in the useEffect so that it's executed
     * after state update 
     */
    setFieldUpdateCallback(() => 
      () => onChangeCallback(name)
    )
  }

  useEffect(() => {
    
    props.onChange && props.onChange(value)
    
    if( ! fieldUpdateCallback ) return;
    
    fieldUpdateCallback()
    setFieldUpdateCallback(false)
  }, [value])

  const fields = props.fields ?? []

  const hasField = name => (
    fields.map(
      field => field.name ?? false
    ).includes(name)
  )

  const renderType = (data) => {
    switch (data.renderType) {
      case 'element':
        return ( getElement(data) )
        break;
    
      default:
        return ( getControl(data) )
        break;
    }
  }

  const getElement = (element) => (
    <Element
      { ...element }
      value={ value[element.name] ?? '' }
      itemType={ 'subfield' }
      onChange={ value => setAttribute(element.name, value) }
      visibility={{
        condition : element.condition?.condition ?? false,
        action    : element.condition?.action ?? 'show',
      }}
      /**
       * Used by visbility and dependent values to detect changes and access data
       */
      data={{
        /**
         * The field value can either be from a subvalue or from another field value
         */
        getValue: name => (
          hasField(name)
            ? (valueRef.current[name] ?? '')
            : (props.data.getValue(name) ?? '')
        ),
        /**
         * Needed to trigger a re-evaluatation of the visibility conditions / dependent values
         * when a subfield value change
         */
        watcher: evaluationCallback => {
          setChangeCallback(() => name => evaluationCallback(name) )
        }
      }}
    />
  )

  const getControl = (control) => (
    <Control
      { ...control }
      value={ value[control.name] ?? '' }
      itemType={ 'subfield' }
      onChange={ value => setAttribute(control.name, value) }
      visibility={{
        condition : control.condition?.condition ?? false,
        action    : control.condition?.action ?? 'show',
      }}
      /**
       * Used by visbility and dependent values to detect changes and access data
       */
      data={{
        /**
         * The field value can either be from a subvalue or from another field value
         */
        getValue: name => (
          hasField(name)
            ? (valueRef.current[name] ?? '')
            : (props.data.getValue(name) ?? '')
        ),
        /**
         * Needed to trigger a re-evaluatation of the visibility conditions / dependent values
         * when a subfield value change
         */
        watcher: evaluationCallback => {
          setChangeCallback(() => name => evaluationCallback(name) )
        }
      }}
    />
  )

  return(
    <div className="tf-field-group">
      <input type='hidden' name={ props.name ?? '' } value={ JSON.stringify(value) } />
      { fields.map((control, index) => (
        <div key={ index } className="tf-field-group-item">
          { renderType(control) }          
        </div>
        )
      )}
    </div>
  )
}

export default FieldGroup
