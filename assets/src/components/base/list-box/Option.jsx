import { useRef } from 'react'

import { 
  mergeProps, 
  useFocusRing, 
  useOption 
} from 'react-aria'

const Option = ({ item, state }) => {
  
  const ref = useRef()
  const { 
    optionProps, 
    isSelected, 
    isDisabled 
  } = useOption({ key: item.key }, state, ref)

  const { isFocusVisible, focusProps } = useFocusRing()
  
  let classes = 'tf-list-box-option'
  
  if( isSelected ) classes = classes += ' tf-list-box-option-selected'
  if( isDisabled ) classes = classes += ' tf-list-box-option-disabled'
  if( isFocusVisible ) classes = classes += ' tf-list-box-option-focus'
  
  return(
    <li
      { ...mergeProps(optionProps, focusProps) }
      ref={ ref }
      class={ classes }
    >
      { item.rendered }
    </li>
  )
}

export default Option
