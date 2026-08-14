import {
  useContext,
  useRef
} from 'react'

import { 
  useRadio,
  VisuallyHidden
} from 'react-aria' 

const ButtonOption = props => {
  
  const state = useContext(props.context)
  const ref = useRef(null)  

  const { inputProps } = useRadio(props, state, ref)

  let classes = 'tf-button-group-option'
  if( state.selectedValue === props.value ) {
    classes += ' tf-button-group-option-selected'
  } 
  
  return(
    <label className={ classes }>
      <VisuallyHidden>
        <input { ...inputProps } ref={ ref } />
      </VisuallyHidden>
      { props.children }
    </label>
  )
}

export default ButtonOption
