import { useRef } from 'react'

import { 
  mergeProps, 
  useFocusRing, 
  useOption 
} from 'react-aria'
import ListCheckbox from './ListCheckbox'

const Option = ({ item, state, hasCheckbox }) => {
  
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
  if( hasCheckbox ) classes = classes += ' tf-list-box-option-has-checkbox'
  
  return(
    <li
      { ...mergeProps(optionProps, focusProps) }
      ref={ ref }
      className={ classes }
    >
      {hasCheckbox && <ListCheckbox item={item} state={state} />}
      { item.rendered }
    </li>
  )
}

export default Option
