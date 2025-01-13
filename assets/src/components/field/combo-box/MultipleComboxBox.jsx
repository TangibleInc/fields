import {
  useEffect,
  useState, 
  useRef 
} from 'react'

import { 
  useFilter,
  useComboBox
} from 'react-aria'

import { 
  onSelectionChange,
  getSelectedKey,
  getDisabledKeys,
  setInputValue
} from './common'

import { useComboBoxState } from 'react-stately'
import { getLayout } from './layout'

/**
 * Very similar to <ComboBox />, but with an additional state to handle multiple values
 * 
 * We might be able to merge both into a single component at some point, but so far it
 * has been easier to keep them separated
 */
const MultipleComboBox = props => {

  const buttonRef  = useRef()
  const inputRef   = useRef()
  const listBoxRef = useRef()
  const popoverRef = useRef()
  const wrapperRef = useRef()

  /**
   * The value is different according to if we get the item list in async mode or not
   * 
   * If it's the case, the initial value will be an array of object, that contains the
   * value and the label for each item selected
   * 
   * Otherwise, it's a comma separated string with each value
   */
  const [values, setValues] = useState(
    props.value && Array.isArray(props.value)
      ? props.value
      : (props.value && ! props.isAsync ? props.value.split(',') : [])
  )

  useEffect(() => props.onChange && props.onChange(values), [values.length])
  useEffect(() => { setInputValue(props, state) }, [])

  /**
   * Needed to filter item results according to input value
   *
   * @see https://react-spectrum.adobe.com/react-aria/useFilter.html
   */
  const { contains } = useFilter({ sensitivity: 'base' })
  const state = useComboBoxState({
    ...props,
    onSelectionChange : value => onSelectionChange(value, props, state),
    selectedKey       : getSelectedKey(props),
    defaultFilter     : contains,
    disabledKeys      : getDisabledKeys(props)
  })

  const {
    buttonProps,
    inputProps,
    listBoxProps,
    labelProps,
    descriptionProps
  } = useComboBox({
    ...props,
    inputRef,
    buttonRef,
    listBoxRef,
    popoverRef,
    menuTrigger: 'input'
  }, state)

  const add = value => {
    if ( values.indexOf(value) !== -1 ) return
    setValues([
      ...values,
      value
    ])
  }

  const remove = i => {
    if ( ! values[ i ] ) return;
    setValues([
      ...values.slice(0, i),
      ...values.slice(i + 1)
    ])
  }

  const getDisabledValues = () => (
    props.isAsync
      ? values.map(item => (item.value))
      : values
  )
  
  /**
   * We pass everything in a single ref as we can't forward
   * multiple refs from the layout components
   *
   * @see https://stackoverflow.com/a/53818443
   */
  const layoutRefs = useRef({
    tirgger : buttonRef,
    input   : inputRef,
    popover : popoverRef,
    wrapper : wrapperRef,
    listbox : listBoxRef
  })

  const Layout = getLayout( props.layout ?? 'simple-multiple' )

  return(
    <Layout
      parent={ props }
      labelProps={ labelProps }
      descriptionProps={ descriptionProps }
      inputProps={ inputProps }
      buttonProps={ buttonProps }
      listBoxProps={ listBoxProps }
      itemProps={ props.itemProps }
      ref={ layoutRefs }
      state={ state }
      multiple={{
        getDisabledValues,
        add,
        remove,
        values
      }}
    />
  )
}

export default MultipleComboBox
