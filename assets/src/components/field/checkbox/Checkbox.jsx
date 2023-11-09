import { 
  useEffect,
  useRef,
  Fragment
} from 'react'

import { useToggleState } from 'react-stately'
import { 
  useCheckbox, 
  useField,
  VisuallyHidden 
} from 'react-aria'

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
  const { inputProps } = useCheckbox({ 
    ...props,
    children: props.label ?? false 
  }, state, ref)

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

  /**
   * If label needs to be visually hidden for the checkbox, we can't rely on the labelVisuallyHidden
   * prop of the Label component as the checkbox element is also inside the label and needs to be Visibile 
   * in any case 
   */
  const LabelWrapper = props?.labelVisuallyHidden ? VisuallyHidden : Fragment
  
  return(
    <div className="tf-checkbox">
      <Label labelProps={ labelProps } parent={{ ...props, labelVisuallyHidden: false }}>
        <input { ...inputProps } ref={ ref } />
        <input type="hidden" name={ props.name ?? '' } value={ state.isSelected ? '1' : '0' } />
        <LabelWrapper>
          { props.label ?? '' }
        </LabelWrapper>
			</Label>
      { props.description &&
        <Description descriptionProps={ descriptionProps } parent={ props }>
          { props.description }
        </Description> }
    </div>
  )
}

export default Checkbox
