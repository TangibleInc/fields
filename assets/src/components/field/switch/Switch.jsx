import { 
  useRef,
  useEffect 
} from 'react'

import {
  useFocusRing, 
  useSwitch, 
  VisuallyHidden,
  useField
} from 'react-aria'

import { useToggleState } from 'react-stately'

import { 
  Description,
  Label 
} from '../../base'

/**
 * @see https://react-spectrum.adobe.com/react-aria/useSwitch.html
 */

const Switch = props => {

  const state = useToggleState(props)
  const ref = useRef()

  const { inputProps } = useSwitch(props, state, ref)
  const { focusProps } = useFocusRing()
  
  /**
   * useSwitch does not return label and description props directly
   */
  const { 
    labelProps, 
    fieldProps,
    descriptionProps 
  } = useField(props)

  useEffect(() => props.onChange && props.onChange(state.isSelected), [state.isSelected])
  useEffect(() => {
    if( props.value !== state.isSelected )  state.setSelected(props.value)
  }, [props.value])

  return(
    <div className="tf-switch">
      { props.label &&
        <Label { ...labelProps }>
          { props.label }
        </Label> }
        <label>
          <VisuallyHidden>
            <input 
              { ...fieldProps }
              { ...inputProps } 
              { ...focusProps }
              ref={ ref } 
              name="" 
            />
          </VisuallyHidden>
          <div className={ `tf-switch-element${state.isSelected ? '-selected' : '' }` } aria-hidden="true">
            <span></span>
          </div>
        </label>
      { props.description &&
        <Description { ...descriptionProps }>
          { props.description }
        </Description> }
    </div>
  )
}

export default Switch
