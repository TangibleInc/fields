import { 
  useEffect,
  useState,
  useContext,
  useMemo
} from 'react'

import { 
  evaluateFieldVisibility,
  getTriggerFields
} from './visibility/'

import { 
  addEventListener,
  triggerEvent
} from './events'

import { OverlayProvider } from 'react-aria'
import { dynamicValuesAPI } from './dynamic-values'

import controls from './controls-list.js'

const Control = ({
  visibility,
  ...props
}) => {

  /**
   * @see renderField() in ./src/index.jsx 
   */
  const { ControlContext } = tangibleFields 
  const control = useContext(ControlContext)

  const wrapper = {
    ...(props.wrapper ?? {}),
    className: `${props?.wrapper?.class ?? ''} ${control.wrapper}`
  }

  const [value, setValue] = useState(props.value ?? '')
  const [isVisible, setVisibility] = useState(false) // False until we evaluate conditions
  
  useEffect(() => {
    props.onChange && props.onChange(value)
  }, [value])

  const type = props.type ?? 'text'
  const ControlComponent = controls[type] ?? false

  if (!ControlComponent) return <></>;

  const childProps = Object.assign({}, props)

  delete childProps.value
  delete childProps.onChange
  delete childProps.class
  delete childProps.wrapper

  const onChange = newValue => {

    setValue(newValue)

    // The timeout make sure the event is dispatched after the state changed
    setTimeout(() => {
      triggerEvent('valueChange', {
        name: props.name ?? false,
        props: props,
        value: newValue,
      })
    })
  }
  
  const evaluateVisibility = () => {

    if( ! visibility.condition ) {
      setVisibility(true)
      return;
    } 

    // The default callback looks only for a value in other defined fields, but we can overwrite it if needed
    const getValue = visibility.getValue ?? control.getValue
    const result = evaluateFieldVisibility(visibility.condition, getValue)
    
    setVisibility( visibility.action !== 'hide' ? result : ! result )
  }

  useEffect(() => {
    
    evaluateVisibility() // Initial visibility
    
    if( ! visibility.condition || ! triggerFields ) {
      return;
    } 

    /**
     * Trigger visibility re-evaluation on
     */
    addEventListener('valueChange', field => {

      // We rely on visibility.watcher for subfield changes (@see below)
      if( field.props?.controlType === 'subfield' ) return;
      
      // Avoid unnecessary evaluations
      if( ! triggerFields.includes(field.name) ) return;  
      
      setTimeout(evaluateVisibility)
    })

    /**
     * The visibility watcher is an additional callback we can use to evaluate
     *  
     * It is currently used to watch changes in subfields (repeaters, field-groups)
     */
    if( visibility.watcher ) {
      visibility.watcher(fieldName => {
        // Avoid unnecessary evaluations
        if( triggerFields.includes(fieldName) ) evaluateVisibility()
      })
    }
  }, [])
  
  /**
   * Determine for which fields a value change should trigger a re-evaluation of 
   * the visibility conditions (see visibility.watcher)
   */
  const triggerFields = useMemo(() => (
    visibility.condition ? getTriggerFields(visibility.condition) : false
  ))

  if ( ! isVisible ) return <></>;
  
  return (
    <OverlayProvider { ...wrapper }>
      <ControlComponent 
        { ...childProps } 
        value={ value }
        onChange={ onChange } 
        dynamic={ props.dynamic 
          ? dynamicValuesAPI(value, setValue, props.dynamic) 
          : false 
        }
      />
    </OverlayProvider>
  )
}

export default Control
