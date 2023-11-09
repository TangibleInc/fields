import { 
  useEffect,
  createContext
} from 'react'

import { useRadioGroup } from 'react-aria'
import { useRadioGroupState } from 'react-stately'
import { getOptions } from '../../../utils'

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
  const options = getOptions(props.choices ?? {})

  const {
    radioGroupProps,
    labelProps,
    descriptionProps
  } = useRadioGroup(props, state)

  useEffect(() => { 
    props.onChange && props.onChange(state.selectedValue)
  }, [state.selectedValue])

  return(
    <div className="tf-button-group">
      { props.label &&
        <Label labelProps={ labelProps } parent={ props }>
          { props.label }
        </Label> }
      <div className="tf-button-group-container" { ...radioGroupProps }>
        <ButtonGroupContext.Provider value={ state }>
          { options.map(option => (
            <ButtonOption key={ option.value } context={ ButtonGroupContext } { ...option } >
              { props.use_dashicon
                ? <span className={ `dashicons dashicons-${option.label}`}></span>
                : option.label }
            </ButtonOption>
          )) }
        </ButtonGroupContext.Provider>
      </div>
      { props.description &&
        <Description descriptionProps={ descriptionProps } parent={ props }>
          { props.description }
        </Description> }
    </div>
  )
}

export default ButtonGroup
