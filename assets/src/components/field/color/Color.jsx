import { 
  useEffect,
  useRef,
  useState 
} from 'react'

import { useColorField } from '@react-aria/color'
import { useColorFieldState } from '@react-stately/color'

import { 
  Description,
  Label,
  Popover
} from '../../base'

import ColorPicker from './ColorPicker'

/**
 * @see https://react-spectrum.adobe.com/react-aria/useColorField.html 
 */

const Color = props =>{

  const ref = useRef()
  const popover = useRef()

  const state = useColorFieldState(props)
  const [open, isOpen] = useState(false)

  const {
    labelProps,
    inputProps,
    descriptionProps
  } = useColorField(props, state, ref)

  const format = props.format ?? 'hexa'
  
  const onChange = value => {

    const stringValue = value.toString ? value.toString(format) : ''
    state.setInputValue(stringValue)
    
    if( props.onChange ) props.onChange(stringValue) 
  }

  /**
   * Use the right format on initial render
   */
  useEffect(() => state.setInputValue(
    state.colorValue?.toString(format)   
  ), [])
  
  return(
    <div class="tf-color">
      { props.label &&
        <Label { ...labelProps }>
          { props.label }
        </Label> }
      <div class="tf-color-container">
        <input ref={ ref } { ...inputProps } 
          onFocus={ () => isOpen(true)}
          value={ state.inputValue }
        />
        { open && 
          <Popover ref={ popover }>
            <ColorPicker 
              value={ state.colorValue?.toString(format) }
              onChange={ onChange } 
              hasAlpha={ props.hasAlpha ?? true } 
              onFocusChange={ isFocus => isOpen(isFocus) }
            />
          </Popover> }
      </div>        
      { props.description &&
        <Description { ...descriptionProps }>
          { props.description }
        </Description> }
    </div>
  )
}

export default Color
