import { 
  useState,
  useEffect,
  useMemo
} from 'react'

import { 
  evaluateFieldVisibility,
  getTriggerFields
} from '../../visibility/'

import { addEventListener } from '../../events'

const VisibilityWrapper = ({
  visibility,
  data,
  ...props
}) => {

  const [isVisible, setVisibility] = useState(false) // False until we evaluate conditions

  const evaluateVisibility = () => {

    if( ! visibility.condition ) {
      setVisibility(true)
      return;
    } 

    // The default callback looks only for a value in other defined fields, but we can overwrite it if needed
    const getValue = data.getValue ?? control.getValue
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

      // We rely on data.watcher for subfield changes (@see below)
      if( field.props?.itemType === 'subfield' ) return;
      
      // Avoid unnecessary evaluations
      if( ! triggerFields.includes(field.name) ) return;  
      
      setTimeout(evaluateVisibility)
    })

    /**
     * The visibility watcher is an additional callback we can use to evaluate
     *  
     * It is currently used to watch changes in subfields (repeaters, field-groups)
     */
    if( data.watcher ) {
      data.watcher(fieldName => {
        // Avoid unnecessary evaluations
        const result = triggerFields.filter( (name) => name.split('.')[0] === fieldName )
        if( result.length !== 0 ) evaluateVisibility()
      })
    }
  }, [])
  
  /**
   * Determine for which fields a value change should trigger a re-evaluation of 
   * the visibility conditions (see visibility.watcher)
   */
  const triggerFields = useMemo(() => (
    visibility.condition ? getTriggerFields(visibility.condition) : false
  ), [])

  return isVisible ? props.children : <></>
}

export default VisibilityWrapper
