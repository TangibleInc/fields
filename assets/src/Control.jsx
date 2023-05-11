import { 
  useReducer, 
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
import { controlDispatcher } from './dispatcher.js'

import controls from './controls-list.js'
import { format } from './format'
import { dynamicValuesAPI } from './dynamic-values'

const Control = ({
  visibility,
  ...props
}) => {
  /**
   * Each field value use a JSON structure, handled by this dispatcher
   * 
   * @see dispatcher.js
   * @see format.js
   */
  const [data, dispatch] = useReducer(
    controlDispatcher, 
    format(
      props.value ?? '', 
      props.default ?? ''
    )
  )

  useEffect(() => props.onChange && props.onChange(data), [data?.value])
  useEffect(() => props.onChange && props.onChange(data), [data?.dynamicValues])

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
  delete childProps.name
  delete childProps.class
  delete childProps.wrapper

  const onChange = newValue => {
  
    dispatch({
      type: 'updateValue',
      value: newValue
    })

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
      
      evaluateVisibility()
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
      <input type="hidden" name={ props.name ?? '' } value={ JSON.stringify(data) } />
      <ControlComponent 
        { ...childProps } 
        value={ data.value }
        onChange={ onChange } 
        dynamic={ props.dynamic 
          ? dynamicValuesAPI(data, dispatch, props.dynamic) 
          : false 
        }
      />
    </OverlayProvider>
  )
}

export default Control
