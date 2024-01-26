import { 
  useRef, 
  useEffect 
} from 'react'

import { useComboBoxState } from 'react-stately'

import {  
  useFilter,
  useComboBox,
  useFocusWithin,
  FocusScope
} from 'react-aria'

import { 
  Button,
  Label,
  Description,
  ListBox,
  Popover
 } from '../../base'

 import { getOption } from '../../../utils'

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
   * The returned value is diffent accoding to if the current combobox get item
   * in async mode or not
   * 
   * If true, return an object with value + label, otherwise return just the value
   */
  const onSelectionChange = value => {
    
    if( ! props.isAsync ) {
      props.onSelectionChange(value)
      return;
    }

    const option = getOption(value, props.items)

    props.onSelectionChange(option)
    if( ! props.multiple ) state.setInputValue(option.label)
  }

  /**
   * For some reason the inputValue is not correctly initialized in async mode
   */
  useEffect(() => {
    props.isAsync && props.selectedKey 
      ? state.setInputValue(props.selectedKey.label ?? '')
      : null
  }, [])

  /**
   * Needed to filter item results according to input value
   * 
   * @see https://react-spectrum.adobe.com/react-aria/useFilter.html
   */
  const { contains } = useFilter({ sensitivity: 'base' })
  const state = useComboBoxState({ 
    ...props, 
    onSelectionChange: onSelectionChange,
    selectedKey: props.isAsync && props.selectedKey?.value 
      ? props.selectedKey.value 
      : (props.selectedKey ?? ''),
    defaultFilter: contains 
  })

  const triggerRef = useRef()
  const inputRef   = useRef()
  const listBoxRef = useRef()
  const popoverRef = useRef()
  const wrapperRef = useRef()

  const {
    buttonProps,
    inputProps,
    listBoxProps,
    labelProps,
    descriptionProps
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
    onFocusWithinChange: isFocus => {
      props.onFocusChange ? props.onFocusChange(isFocus) : false
    }
  })

  return(
    <div className="tf-combo-box" { ...focusWithinProps }>
      { props.label &&
        <Label labelProps={ labelProps } parent={ props }>
          { props.label }
        </Label> }
      <FocusScope autoFocus={ props.autoFocus } restoreFocus>
        <div className="tf-combo-box-text" ref={ wrapperRef }>
          <input { ...inputProps } ref={ inputRef } />
          {/* add changeTag="span" to change the button to span element */}

          { props.showButton &&  
            <Button type="action" ref={ triggerRef } preventFocusOnPress={ true } { ...buttonProps }>
              <span aria-hidden="true">
                ▼
              </span>
            </Button> }

          { state.isOpen && 
            <Popover
              state={state}
              triggerRef={inputRef}
              popoverRef={popoverRef}
              placement="bottom start"
              style={{ width: wrapperRef?.current?.offsetWidth }}
              className={ 'tf-combo-box-popover' }
            >
              <ListBox
                listBoxRef={ listBoxRef }
                state={ state }
                items={ props.items }
                focusWithinProps
                shouldUseVirtualFocus
                { ...listBoxProps }
              />
            </Popover> }
        </div>
      </FocusScope>
      { props.description &&
        <Description descriptionProps={ descriptionProps } parent={ props }>
          { props.description }
        </Description> }
    </div>
  )
}

export default ComboBox
