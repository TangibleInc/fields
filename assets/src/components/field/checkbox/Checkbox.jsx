import { 
  useEffect,
  useRef 
} from 'react'

import { useToggleState } from 'react-stately'
import { useCheckbox, useField } from 'react-aria'

import { 
  Description,
  Label 
} from '../../base'

/**
 * @see https://react-spectrum.adobe.com/react-aria/useCheckbox.html
 */

const Checkbox = props => {

  const state = useToggleState(props)
  const ref = useRef()
  const { inputProps } = useCheckbox(props, state, ref)

  /**
   * useCheckbox does not return label and description props directly
   */
  const { 
    labelProps, 
    descriptionProps 
  } = useField(props)

  useEffect(() => props.onChange && props.onChange(state.isSelected), [state.isSelected])
  useEffect(() => {
    if( props.value === '1' ) state.setSelected(true)
    if( typeof props.value === 'boolean' && props.value !== state.isSelected ) {
      state.setSelected(props.value)
    } 
  }, [props.value])
  
  return(
    <div className="tf-checkbox">
      <Label { ...labelProps }>
        <input { ...inputProps } ref={ ref } />
        <input type="hidden" name={ props.name ?? '' } value={ state.isSelected ? '1' : '0' } />
        { props.label ?? '' }
      </Label> 
      { props.description &&
        <Description { ...descriptionProps }>
          { props.description }
        </Description> }
    </div>
  )
}

export default Checkbox
