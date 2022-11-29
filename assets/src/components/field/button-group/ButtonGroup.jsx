import { 
  useEffect,
  createContext
} from 'react'

import { useRadioGroup } from 'react-aria'
import { useRadioGroupState } from 'react-stately'

import ButtonOption from './ButtonOption'
import {
  Description,
  Label
} from '../../base'

const ButtonGroupContext = createContext(null)

/**
 * @see https://react-spectrum.adobe.com/react-aria/useRadioGroup.html
 */
const ButtonGroup = props => {


  const state = useRadioGroupState(props)

  const {
    radioGroupProps,
    labelProps,
    descriptionProps
  } = useRadioGroup(props, state)

  if( props.onChange ) {
    useEffect(() => props.onChange(state.selectedValue), [state.selectedValue])
  }

  return(
    <div class="tf-button-group">
      { props.label &&
        <Label { ...labelProps }>
          { props.label }
        </Label> }
      <div class="tf-button-group-container" { ...radioGroupProps }>
        <ButtonGroupContext.Provider value={ state }>
          { props.options?.map(option => (
            <ButtonOption context={ ButtonGroupContext } { ...option } >
              { option.dashicon
                ? <span class={ `dashicons dashicons-${option.dashicon}`}></span>
                : option.label }
            </ButtonOption>
          )) }
        </ButtonGroupContext.Provider>
      </div>
      { props.description &&
        <Description { ...descriptionProps }>
          { props.description }
        </Description> }
    </div>
  )
}

export default ButtonGroup
