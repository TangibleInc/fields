import { useRef } from 'react'

import { 
  mergeProps, 
  useFocusRing, 
  useOption 
} from 'react-aria'
import ListCheckbox from './ListCheckbox'

const Option = ({ item, state }) => {
  
  const ref = useRef()
  const { 
    optionProps, 
    isSelected, 
    isFocused,
    isDisabled 
  } = useOption({ key: item.key }, state, ref)
  
  const { focusProps } = useFocusRing()
  
  let classes = 'tf-list-box-option'
  
  if( isSelected ) classes = classes += ' tf-list-box-option-selected'
  if( isDisabled ) classes = classes += ' tf-list-box-option-disabled'
  if( isFocused ) classes = classes += ' tf-list-box-option-focus'
  if( item?.props?.isViewMode ) classes = classes += ' tf-combo-box-item tf-list-box-option-view-mode'
  if( item?.props?.hasCheckBox || item?.props?.isViewMode ) classes = classes += ' tf-list-box-option-has-checkbox '
  
  return(
    <li
      { ...( !item?.props?.isViewMode && mergeProps(optionProps, focusProps)) }
      ref={ ref }
      className={ classes }
    >
      { item?.props?.hasCheckBox && !item?.props?.isViewMode && <ListCheckbox item={item} state={state} />}
      { item.rendered }
    </li>
  )
}

export default Option
