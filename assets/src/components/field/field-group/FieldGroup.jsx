import { 
  useState,
  useEffect,
  useRef
} from 'react'

import { initJSON } from '../../../utils'
import FieldGroupItem from './FieldGroupItem'

/**
 * Display other field and save all values in a single json object 
 */
const FieldGroup = props => {

  const [onChangeCallback, setChangeCallback] = useState([])
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

    if( onChangeCallback.length === 0 ) return;

    /**
     * Save the callback to use it in the useEffect so that it's executed
     * after state update 
     */
    setFieldUpdateCallback(() => 
      () => {
        onChangeCallback.map(callback => callback(name))
      }
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

  return(
    <div className="tf-field-group">
      <input type='hidden' name={ props.name ?? '' } value={ JSON.stringify(value) } />
      { fields.map((config, index) => (
        <div key={ index } className="tf-field-group-item">
          <FieldGroupItem
            values={ value }
            config={ config }
            onChange={ value => setAttribute(config.name, value) }
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
                setChangeCallback(prevValue => [
                  ...prevValue,
                  name => evaluationCallback(name) 
                ])
              }
            }}
          />
        </div>
        )) }
    </div>
  )
}

export default FieldGroup
