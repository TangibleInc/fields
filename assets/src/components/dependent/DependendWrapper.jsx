import { 
  useMemo,
  useState,
  useEffect,
  useCallback,
  Fragment
} from 'react'

import { 
  addEventListener,
  removeEventListener
} from '../../events'

import { 
  getDependentFields,
  mergeDependentProps 
} from './utils'

const DependendWrapper = ({
  renderControl,
  controlProps,
  data
}) => {
  
  const [key, setKey] = useState(0)

  const childProps =  Object.assign({}, controlProps)

  delete childProps.value
  delete childProps.onChange
  delete childProps.class
  delete childProps.wrapper

  /**
   * Store fields that needs to be watched in order to update dependent values accordingly
   */
  const dependentFields = useMemo(() => (
    controlProps.dependent
      ? Object.assign({}, getDependentFields(controlProps))
      : false
  ), [])

  const maybeUpdateProps = (fieldName) => {

    if( ! controlProps.dependent || ! dependentFields ) return;
    if( ! Object.keys(dependentFields).includes(fieldName) ) return;

    setKey(key + 1)
  }

  const dependentWatcher = useCallback(field => {

    // Only regular fields (event is also triggerd for repeater subfields)
    if( field.props?.controlType === 'subfield' ) return;

    maybeUpdateProps(field.name)
  }, [key])
  
  useEffect(() => {
    const callback = addEventListener('valueChange', dependentWatcher)
    return () => removeEventListener('valueChange', callback)
  }, [dependentWatcher])

  /**
   * The visibility watcher is an additional callback we can use to watch changes
   *  
   * It is currently used to watch changes in subfields (repeaters, field-groups)
   */
  useEffect(() => {
    if( data.watcher ) {
      data.watcher((fieldName) => {
        maybeUpdateProps(fieldName)
      })
    }
  }, [dependentWatcher])

  const formatedProps = useMemo(() => (
    mergeDependentProps(
      childProps,
      dependentFields,
      data.getValue
    )
  ), [key])
  
  return(
    <Fragment key={ key }>
      { renderControl(formatedProps) }
    </Fragment>
  )
}

export default DependendWrapper
