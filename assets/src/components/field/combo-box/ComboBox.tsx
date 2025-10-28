import { 
  useRef, 
  useEffect 
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
 * <ComboBox label='Favorite Color'>
 *   <Item>Red</Item>
 *   <Item>Orange</Item>
 *   <Item>Yellow</Item>
 * </Select>
 * 
 * @see https://react-spectrum.adobe.com/react-aria/useComboBox.html
 * @see https://codesandbox.io/s/h185r?file=/src/App.js
 */

const ComboBox = props => {

  const buttonRef  = useRef()
  const inputRef   = useRef()
  const listBoxRef = useRef()
  const popoverRef = useRef()
  const wrapperRef = useRef()
    
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

  const Layout = getLayout( props.layout ?? 'simple' )

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
      multiple={ false }
    />
  )
}

export default ComboBox
