import { useRef } from 'react'

import { 
  useSelectState, 
  Item 
} from 'react-stately'

import {
  HiddenSelect, 
  useSelect
} from 'react-aria'

import { 
  Button, 
  ListBox, 
  Popover,
  Label,
  Description
} from '../../base'

/**
 * <Select label='Favorite Color'>
 *   <Item>Red</Item>
 *   <Item>Orange</Item>
 *   <Item>Yellow</Item>
 * </Select>
 * 
 * @see https://react-spectrum.adobe.com/react-aria/useSelect.html
 */

const Select = props => {
    
  const state = useSelectState(props)

  const ref = useRef()
  const {
    labelProps,
    descriptionProps,
    triggerProps,
    valueProps,
    menuProps
  } = useSelect(props, state, ref)
  
  return(
    <div class="tf-select">
      { props.label &&
        <Label { ...labelProps }>
          { props.label }
        </Label> }
      <HiddenSelect
        state={ state }
        triggerRef={ ref }
        label={ props.label }
        name={ props.name }
      />
      <Button
        ref={ ref }
        type={ 'select' }
        { ...triggerProps }
      >
        <span { ...valueProps }>
          { state.selectedItem
            ? state.selectedItem.rendered
            : (props.placeholder ?? 'Select an option') }
        </span>
        <span aria-hidden="true" class="tf-select-icon">
          ▼
        </span>
      </Button>
      { state.isOpen && 
        <Popover 
          isOpen={ state.isOpen } 
          onClose={ state.close }
          ref={ ref }
        >
          <ListBox
            { ...menuProps }
            state={ state }
            items={ props.items }
          >
            { item => <Item key={ item.id }>{ item.name }</Item> }
          </ListBox>
        </Popover> }
        { props.description &&
          <Description { ...descriptionProps }>
            { props.description }
          </Description> }
    </div>
  )
}

export default Select
