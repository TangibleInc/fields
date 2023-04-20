import {
  useState,
  useEffect,
  useContext,
  useMemo
} from 'react'

import { OverlayProvider } from 'react-aria'
import controls from './controls-list.js'

import { 
  evaluateFieldVisibility,
  getTriggerFields
} from './visibility/field.js'

import { 
  dispatchEvent,
  addEventListener 
} from './events'

const Control = props => {
  
  /**
   * @see renderField() in ./src/index.jsx 
   */
  const { ThemeContext } = tangibleFields 
  const theme = useContext(ThemeContext)
  
  const wrapper = {
    ...(props.wrapper ?? {}),
    class: `${props?.wrapper?.class ?? ''} ${theme.wrapper}`
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

    /**
     * The timeout make sure the event is dispatched after the value changed
     */
    setTimeout(() => {
      dispatchEvent('valueChange', {
        name: props.name ?? false,
        props: props,
        value: newValue,
      })
    })
  }

  /**
   * Determine for which fields a value change should trigger a re-evaluation of 
   * the visibility conditions
   */
  const triggerFields = useMemo(() => (
    props.conditions 
      ? getTriggerFields(props.conditions)
      : false
  ))

  const evaluateVisibility = () => {
    props.conditions
      ? setVisibility( evaluateFieldVisibility(props.conditions) )
      : setVisibility(true)
  }

  useEffect(() => {
    
    evaluateVisibility() // Initial visibility
    
    if( ! props.conditions || ! triggerFields ) return;

    /**
     * Evaluate visibility conditions on value change
     * 
     * @see ./visibility/fields.js
     */
    addEventListener('valueChange', field => {
      
      if( ! triggerFields.includes(field.name) ) return;
      
      evaluateVisibility()
    })
  }, []) 

  if ( ! isVisible ) return <></>;
  
  return (
    <OverlayProvider { ...wrapper }>
      <ControlComponent value={value} onChange={onChange} { ...childProps } />
    </OverlayProvider>
  )
}

export default Control
