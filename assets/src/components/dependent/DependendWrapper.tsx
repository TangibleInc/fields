import {
  useMemo,
  useEffect,
  useCallback
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
  itemProps,
  refresh,
  data,
  children
}) => {

  const childProps =  Object.assign({}, itemProps)

  delete childProps.value
  delete childProps.onChange
  delete childProps.class
  delete childProps.wrapper

  /**
   * Store fields that needs to be watched in order to update dependent values accordingly
   */
  const dependentFields = useMemo(() => (
    itemProps.dependent
      ? Object.assign({}, getDependentFields(itemProps))
      : false
  ), [])

  const maybeUpdateProps = (fieldName) => {

    if( ! itemProps.dependent || ! dependentFields ) return;
    if( ! Object.keys(dependentFields).includes(fieldName) ) return;

    refresh()
  }

  const dependentWatcher = useCallback(field => {

    // Only regular fields (event is also triggerd for repeater subfields)
    if( field.props?.itemType === 'subfield' ) return;

    maybeUpdateProps(field.name)
  }, [])

  useEffect(() => {
    const callback = addEventListener('valueChange', dependentWatcher)
    return () => removeEventListener('valueChange', callback)
  }, [dependentWatcher])

  /**
   * The data watcher is an additional callback we can use to watch changes
   *
   * It is currently used to watch changes in subfields (repeaters, field-groups)
   */
  useEffect(() => {
    if( data.watcher ) {
      data.watcher(fieldName => {
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
  ), [])

  return children(formatedProps)
}

export default DependendWrapper
