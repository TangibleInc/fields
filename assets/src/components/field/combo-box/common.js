import { getOption } from '../../../utils'

/**
  * The returned value is diffent accoding to if the current combobox get item
  * in async mode or not
  * 
  * If true, return an object with value + label, otherwise return just the value
  */
const onSelectionChange = (value, props, state) => {
  console.log('_______')
  console.log(props)
  if( ! props.isAsync ) {
    props.onSelectionChange(value)
    return;
  }

  const option = getOption(value, props.items)
  console.log(option)
  props.onSelectionChange(option)
  if( ! props.multiple ) state.setInputValue(option.label)
}

/**
 * For some reason the inputValue is not correctly initialized in async mode
 */
const setInputValue = (props, state) => 
  props.isAsync && props.selectedKey 
    ? state.setInputValue(props.selectedKey.label ?? '')
    : null

const getSelectedKey = props => {
  props.isAsync && props.selectedKey?.value 
    ? props.selectedKey.value 
    : (props.selectedKey ?? '')
}

const getDisabledKeys = props => ([ 
  ...(props.disabledKeys ?? []),
  '_noResults'
])

export {
  onSelectionChange,
  setInputValue,
  getSelectedKey,
  getDisabledKeys
}
