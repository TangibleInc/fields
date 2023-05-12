import { 
  useState,
  useEffect 
} from 'react'

import { 
  useFocusWithin, 
  FocusScope
} from 'react-aria'

import { parseColor } from '@react-stately/color'

import ColorArea from './ColorArea'
import ColorSlider from './ColorSlider'
import Button from '../../base/button/Button'

const ColorPicker = props => {

  const [color, setColor] = useState(
    parseColor(
      props.value && props.value !== '' 
        ? props.value
        : 'rgba(255, 255, 255, 1)'
    ).toHSB()
  )

  const [
    xChannel,
    yChannel,
    zChannel
  ] = color.getColorChannels()

  const [inputColor, setInputColor] = useState(props.value)

  useEffect(() => {
    setInputColor(props.value)
  },[props.value])
  
  useEffect(() => {
    props.onChange && props.onChange(color)
  },[color])

  /**
   * @see https://react-spectrum.adobe.com/react-aria/useFocusWithin.html
   */
   const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange: isFocus => {
      props.onFocusChange ? props.onFocusChange(isFocus) : false
    }
  })

  
  const hasAlpha = props.hasAlpha ?? true

  return(
    <div className="tf-color-picker" { ...focusWithinProps }>
      <FocusScope autoFocus restoreFocus>
        <ColorArea
          aria-labelledby="hsb-label-id-1"
          value={ color }
          onChange={ setColor }
          xChannel={ yChannel }
          yChannel={ zChannel }
        />
        <div className="tf-color-input">
          <label>Color</label>
          <input 
            type="text"
            value={ inputColor }
            onChange={ e => {
              setInputColor(e.target.value)
            }}
            onBlur={ e => {
              props.onChange(e.target.value)
            }}
            />
        </div>          
        <div className="tf-color-sliders">
          <ColorSlider
            channel={ xChannel }
            value={ color }
            onChange={ setColor }
          />
          { hasAlpha && <ColorSlider
            channel={ 'alpha' }
            value={ color }
            onChange={ setColor }
          /> }
        </div>
      </FocusScope>
    </div>
  )
}

export default ColorPicker
