import { useRef } from 'react'
import { useFocusRing } from 'react-aria'
import { useColorArea } from '@react-aria/color'
import { useColorAreaState } from '@react-stately/color'

/**
 * @see https://react-spectrum.adobe.com/react-aria/useColorArea.html#example 
 */

const ColorArea = props => {

  const inputXRef = useRef(null)
  const inputYRef = useRef(null)
  const containerRef = useRef(null)

  const state = useColorAreaState(props)

  const {
    colorAreaProps,
    gradientProps,
    xInputProps,
    yInputProps,
    thumbProps
  } = useColorArea({ 
    ...props, 
    inputXRef, 
    inputYRef, 
    containerRef 
  }, state)

  const { focusProps } = useFocusRing()
    
  return(
    <div 
      class="tf-color-area" 
      ref={ containerRef }
      style={ colorAreaProps.style } 
      { ...colorAreaProps }
    >
      <div 
        class="tf-color-area-gradient"
        style={ gradientProps.style } 
        { ...gradientProps } 
      />
      <div
        class="tf-color-area-thumb"
        style={{
          ...thumbProps.style,
          background: state.getDisplayColor().toString('css'),
        }}
        { ...thumbProps }
      >
        <input ref={ inputXRef } { ...xInputProps } { ...focusProps } />
        <input ref={ inputYRef } { ...yInputProps } { ...focusProps } />
      </div>
    </div>
  )
}

export default ColorArea
