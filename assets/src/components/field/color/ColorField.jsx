import { 
  useEffect,
  useRef,
  useState,
  forwardRef 
} from 'react'

import { Popover } from '../../base'
import ColorPicker from './ColorPicker'

const ColorField = forwardRef(({
  inputProps,
  state,
  ...props
}, ref) =>{

  const [open, isOpen] = useState(false)
  const format = props.format ?? 'hexa'
  const popover = useRef()
  
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
    <div className="tf-color-container">
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
  )
})

export default ColorField
