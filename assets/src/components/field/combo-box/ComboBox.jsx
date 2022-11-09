import { 
  useState, 
  useEffect, 
  useRef
} from 'react'

import {  
  useFilter,
  useComboBox,
  useFocusWithin,
  FocusScope
} from 'react-aria'

import { 
  useComboBoxState, 
  Item, 
  Section 
} from 'react-stately'

import { Button } from '../../base'
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

  /**
   * @see https://react-spectrum.adobe.com/react-aria/useFocusWithin.html
   */
  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange:  isFocus => {
      props.onFocusChange ? props.onFocusChange(isFocus) : false
    }
  })

  return (
    <div class="tf-combo-box" { ...focusWithinProps }>
      { props.label &&
        <label { ...labelProps }>
          { props.label }
        </label> }
      <FocusScope autoFocus restoreFocus>
        <div class="tf-combo-box-text">
          <input { ...inputProps } ref={ inputRef } />
          <Button type="action" ref={ triggerRef } preventFocusOnPress={ true } { ...triggerProps }>
            <span aria-hidden="true">
              ▼
            </span>
          </Button>
          { state.isOpen && (
            <ListBoxPopup
              { ...listBoxProps }
              listBoxRef={ listBoxRef }
              popoverRef={ popoverRef }
              state={ state }
              focusWithinProps
              shouldUseVirtualFocus
            />
          ) }
        </div>
      </FocusScope>
    </div>
  )
}

export default props => {
  
  const [value, setValue] = useState(props.value ?? null)
  
  if( props.onChange ) {
    useEffect( () => props.onChange(value), [value])
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
        onFocusChange={ props.onFocusChange ?? false }
      >
        { item => item.children 
          ? <Section key={ item.name } title={ item.name } items={ item.children }>
              { item => <Item key={ item.name }>{ item.name }</Item> }
            </Section>
          : <Item key={ item.name }>{ item.name }</Item> }
      </ComboBox>
    </>  
  )
}
