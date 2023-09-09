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
  render,
  controlType, 
  setValue,
  name
}) => {

  const [key, setKey] = useState(0)

  const refreshRender = () => setKey(key + 1)
  const refreshValue = field => {
    if( ! name || name !== field.name ) return;
    refreshRender()
    setValue(field.value)
  }

  useEffect(() => {

    // Only support forced refresh for regular field for now (no subfields)
    if( controlType !== 'field' ) return;

    const callback = addEventListener('_refreshFieldValue', refreshValue)
    return () => removeEventListener('_refreshFieldValue', callback)
  }, [key])

  return(
    <Fragment key={ key }>
      { render(refreshRender) }
    </Fragment>
  )
}

export default RenderWrapper
