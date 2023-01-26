import { 
  useEffect,
  useState, 
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

  const [value, setValue] = useState(props.value ?? '0')

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

  useEffect(() => state.setSelected(value === '1'), [])
  useEffect(() => setValue(state.isSelected ? '1' : '0'), [state.isSelected])
  useEffect(() => props.onChange && props.onChange(value), [value])

  return(
		<div class="tf-checkbox">
      <Label { ...labelProps }>
			<label>
        <input { ...inputProps } ref={ ref } />
        { props.label ?? '' }
			</label>
        <input type="hidden" name={ props.name ?? '' } value={ value } />
      </Label> 
      { props.description &&
        <Description { ...descriptionProps }>
          { props.description }
        </Description> }
    </div>
  )
}

export default Checkbox
