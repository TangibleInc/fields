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
  const wrapperRef = useRef()

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
    <div className="tf-color-container" ref={ wrapperRef }>
      <input ref={ ref } { ...inputProps }
        onClick={() => isOpen(true)}
        value={ state.inputValue ?? '' }
      />
      { open &&
        <Popover
          state={{ isOpen: open, close: () => isOpen(false) }}
          triggerRef={ref}
          placement="bottom start"
          style={{ width: wrapperRef?.current?.offsetWidth }}
          className="tf-color-popover"
        >
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
