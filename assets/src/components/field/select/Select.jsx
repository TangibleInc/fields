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
  Popover 
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

  const ref = useRef(null)
  const {
    labelProps,
    triggerProps,
    valueProps,
    menuProps
  } = useSelect(props, state, ref)
  
  return(
    <div class="tf-select">
      <div { ...labelProps }>
        { props.label }
      </div>
      <HiddenSelect
        state={ state }
        triggerRef={ ref }
        label={ props.label }
        name={ props.name }
      />
      <Button
        ref={ ref }
        style={{ height: 30, fontSize: 14 }}
        type={ 'select' }
        { ...triggerProps }
      >
        <span { ...valueProps }>
          { state.selectedItem
            ? state.selectedItem.rendered
            : 'Select an option' }
        </span>
        <span aria-hidden="true" style={{ paddingLeft: 5 }}>
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
            { item => <Item>{ item.name }</Item> }
          </ListBox>
        </Popover> }
    </div>
  )
}

export default props => (
  <Select 
    selectedKey={ props.value } 
    onSelectionChange={ props.onChange } 
    { ...props }
  >
    { item => <Item key={ item.name }>{ item.name }</Item> }
  </Select>
)


