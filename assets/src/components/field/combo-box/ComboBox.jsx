import { 
  useState, 
  useEffect, 
  useRef
} from 'react'

import {  
  useButton,
  useFilter,
  useComboBox
} from 'react-aria'

import {
  Item, 
  useComboBoxState
} from 'react-stately'

import ListBoxPopup from './ListBoxPopup'

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
  
  /**
   * Needed to filter item results according to input value
   * 
   * @see https://react-spectrum.adobe.com/react-aria/useFilter.html
   */
  const { contains } = useFilter({ sensitivity: 'base' })
  const state = useComboBoxState({ ...props, defaultFilter: contains })

  const triggerRef = useRef()
  const inputRef   = useRef()
  const listBoxRef = useRef()
  const popoverRef = useRef()

  const {
    buttonProps: triggerProps,
    inputProps,
    listBoxProps,
    labelProps
  } = useComboBox({
      ...props,
      inputRef,
      buttonRef: triggerRef,
      listBoxRef,
      popoverRef,
      menuTrigger: 'input'
  }, state)

  const { buttonProps } = useButton(triggerProps, triggerRef)

  return (
    <div class="tf-combo-box">
      <label { ...labelProps }>
        { props.label }
      </label>
      <div class="tf-combo-box-text">
        <input { ...inputProps } ref={ inputRef } />
        <button { ...buttonProps } ref={ triggerRef }>
          <span aria-hidden="true" style={{ padding: '0 2px' }}>
            ▼
          </span>
        </button>
        { state.isOpen && (
          <ListBoxPopup
            { ...listBoxProps }
            shouldUseVirtualFocus
            listBoxRef={ listBoxRef }
            popoverRef={ popoverRef }
            state={ state }
          />
        ) }
      </div>
    </div>
  )
}

export default props => {
  
  const [value, setValue] = useState(props.value ?? null)
  
  if( props.onChange ) {
    useEffect(props.onChange, [value])
  }
  
  return(
    <>
      <input type="hidden" name={ props.name ?? '' } value={ value } />
      <ComboBox 
        focusStrategy={ 'first' }
        label={ props.label ?? null }
        defaultItems={ props.items ?? [] }
        selectedKey={ value } 
        onSelectionChange={ setValue } 
      >
        { item => <Item>{ item.name }</Item> }
      </ComboBox>
    </>  
  )
}
