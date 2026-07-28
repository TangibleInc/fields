import { useRef } from 'react'
import { useFocusRing, useColorArea } from 'react-aria'
import { useColorAreaState } from 'react-stately'

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
      className="tf-color-area"
      ref={ containerRef }
      style={ colorAreaProps.style } 
      { ...colorAreaProps }
    >
      <div 
        className="tf-color-area-gradient"
        style={ gradientProps?.style }
        { ...gradientProps } 
      />
      <div
        className="tf-color-area-thumb"
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
