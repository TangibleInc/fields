import {
  useState,
  useEffect,
  useContext,
  useMemo
} from 'react'

import { OverlayProvider } from 'react-aria'
import { dispatchEvent } from './events'
import controls from './controls-list.js'

import { 
  evaluateFieldVisibility,
  getTriggerFields
} from './visibility/'

const Control = ({
  visibility,
  ...props
}) => {
  
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

    // The timeout make sure the event is dispatched after the state changed
    setTimeout(() => {
      dispatchEvent('valueChange', {
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

    const result = evaluateFieldVisibility(visibility.condition, visibility.getValue)
    setVisibility( visibility.action !== 'hide' ? result : ! result )
  }

  useEffect(() => {
    
    evaluateVisibility() // Initial visibility
    
    if( ! visibility.condition || ! visibility.watcher || ! triggerFields ) {
      return;
    } 

    /**
     * This visibility watcher is a callback we need to initialize at the beggining
     * of the component life
     * 
     * It is used to watch other fields change, and trigger a visibility evaluation when
     * another field value change
     */
    visibility.watcher(fieldName => {
      // Avoid unnecessary evaluations
      if( triggerFields.includes(fieldName) ) evaluateVisibility()
    })
    
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
      <ControlComponent value={value} onChange={onChange} { ...childProps } />
    </OverlayProvider>
  )
}

export default Control
