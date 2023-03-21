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
 */

const Select = props => {

  /**
   * @see https://react-spectrum.adobe.com/react-stately/useSelectState.html
   */
  const state = useSelectState(props)
    
  /**
   * @see https://react-spectrum.adobe.com/react-aria/useSelect.html
   */
  const ref = useRef()
  const listRef = useRef()
  const {
    labelProps,
    descriptionProps,
    valueProps,
    menuProps
  } = useSelect(props, state, ref)
  
  return(
    <div class="tf-select">
        <input type="hidden" name={ props.name ?? '' } value={ [...state.selectedKey].join(',') } />
      { props.label &&
        <Label { ...labelProps }>
          { props.label }
        </Label> }
      <Button
        type={ 'select' }
        onPress={()=> state.open()}
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
            listBoxRef={ listRef }
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