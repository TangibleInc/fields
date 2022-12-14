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
  
  if( props.onChange ) {
    useEffect(() => props.onChange(color),[color])
  }

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
    <div class="tf-color-picker" { ...focusWithinProps }>
      <FocusScope autoFocus restoreFocus>
        <ColorArea
          aria-labelledby="hsb-label-id-1"
          value={ color }
          onChange={ setColor }
          xChannel={ yChannel }
          yChannel={ zChannel }
        />
        <div class="tf-color-sliders">
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
