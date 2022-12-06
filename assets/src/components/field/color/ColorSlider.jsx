import { useRef } from 'react'

import { 
  VisuallyHidden, 
  useLocale, 
  useFocusRing 
} from 'react-aria'

import { useColorSlider } from '@react-aria/color'
import { useColorSliderState } from '@react-stately/color'

/**
 * @see https://react-spectrum.adobe.com/react-aria/useColorSlider.html
 */

const ColorSlider = props => {

  const { locale } = useLocale()
  const state = useColorSliderState({ ...props, locale })
  const trackRef = useRef()
  const inputRef = useRef()

  // Default label to the channel name in the current locale
  const label = props.label || state.value.getChannelName(props.channel, locale)

  const { 
    trackProps, 
    thumbProps, 
    inputProps, 
    labelProps, 
    outputProps 
  } = useColorSlider({
    ...props,
    label,
    trackRef,
    inputRef
  }, state)

  const { focusProps } = useFocusRing()

  return(
    <div class="tf-color-slider">
      <div class="tf-color-slider-label">
        <label { ...labelProps }>
          { label }
        </label>
        <output { ...outputProps }>
          { state.value.formatChannelValue(props.channel, locale) }
        </output>
      </div>
      <div 
        class="tf-color-slider-container"
        ref={ trackRef }
        style={ trackProps.style }
        { ...trackProps }
      >
        <div
          class="tf-color-area-thumb"
          style={{
            ...thumbProps.style,
            background: state.getDisplayColor().toString('css')
          }}
          { ...thumbProps }
        >
          <VisuallyHidden>
            <input ref={inputRef} {...inputProps} {...focusProps} />
          </VisuallyHidden>
        </div>
      </div>
    </div>
  )
}

export default ColorSlider
