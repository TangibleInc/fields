import { 
  useEffect,
  createContext
} from 'react'

import { useRadioGroup } from 'react-aria'
import { useRadioGroupState } from 'react-stately'

import {
  Description,
  Label
} from '../../base'

/**
 * <RadioGroup label="Radio label">
 *   <Radio value="2">Value 1</Radio>
 *   <Radio value="1">Value 2</Radio>
 * </RadioGroup>
 * 
 * @see https://react-spectrum.adobe.com/react-aria/useRadioGroup.html
 */

const RadioContext = createContext(null)

const RadioGroup = props => {

  const state = useRadioGroupState({
    ...props,
    value: props.value,
    onChange: props.onChange,
  })

  const {
    radioGroupProps,
    labelProps,
    descriptionProps
  } = useRadioGroup(props, state)

  return(
    <div className="tf-radio-group">
      { props.label &&
        <Label labelProps={ labelProps } parent={ props }>
          { props.label }
        </Label> }
      <div className="tf-radio-group-container" { ...radioGroupProps }>
        <RadioContext.Provider value={ state }>
          { props.children }
        </RadioContext.Provider>
      </div>
      { props.description &&
        <Description descriptionProps={ descriptionProps } parent={ props }>
          { props.description }
        </Description> }
    </div>
  )
}

export {
  RadioGroup,
  RadioContext
}
