import { 
  useEffect, 
  useState, 
  useRef 
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

  const [value, setValue] = useState(props.value ?? false)
  
  const valueOn = props.valueOn ?? 'on' 
  const valueOff = props.valueOff ?? 'off'

  const state = useToggleState(props)
  const ref = useRef()

  const { inputProps } = useSwitch(props, state, ref)
  const { focusProps } = useFocusRing()
  
  /**
   * useSwitch does not return label and description props directly
   */
  const { 
    labelProps, 
    descriptionProps 
  } = useField(props)

  /**
   * We don't return a boolean like in the useToggleState value, but a custom string
   */
  useEffect(() => state.setSelected(value === valueOn), [])
  useEffect(() => setValue(state.isSelected ? valueOn : valueOff), [state.isSelected])
  useEffect(() => props.onChange && props.onChange(value), [value])

  return(
    <div className="tf-switch">
      { props.label &&
        <Label { ...labelProps }>
          { props.label }
        </Label> }
        <label>
          <VisuallyHidden>
            <input { ...inputProps } { ...focusProps } ref={ ref } name="" />
            <input type="hidden" name={ props.name ?? '' } value={ value } />
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
