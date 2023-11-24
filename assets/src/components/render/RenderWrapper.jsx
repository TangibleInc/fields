import { 
  useState,
  useEffect,
  Fragment
} from 'react'

import { 
  addEventListener,
  removeEventListener
} from '../../events'

/**
 * Handle re-render of a control, it is used in two cases:
 * - Dependent values (force re-render when dependent field value change)
 * - Value update from outside of the control
 * 
 * Could we use useContext for this?
 */
const RenderWrapper = ({ 
  children,
  controlType, 
  setValue,
  name
}) => {

  const [key, setKey] = useState(0)

  const refreshRender = () => setKey(key + 1)

  const fieldValueChanged = field => {
    if( ! name || name !== field.name ) return;
    refreshRender()
    setValue(field.value)
  }

  const maybeRerender = fieldName => {
    fieldName === name ? refreshRender() : null
  }

  useEffect(() => {

    // Only support forced refresh for regular field for now (no subfields)
    if( controlType !== 'field' ) return;

    const callbackValuechanged = addEventListener('_refreshFieldValue', fieldValueChanged)
    const callbackRerender = addEventListener('_fieldRerender', maybeRerender)
    
    return () => {
      removeEventListener('_refreshFieldValue', callbackValuechanged)
      removeEventListener('_fieldRerender', callbackRerender)
    }
  }, [key])

  return(
    <Fragment key={ key }>
      { children(refreshRender) }
    </Fragment>
  )
}

export default RenderWrapper
