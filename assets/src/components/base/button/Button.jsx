import { 
  useRef,
  forwardRef 
} from 'react'
import { useButton } from 'react-aria'

/**
 * @see https://react-spectrum.adobe.com/react-aria/useButton.html
 */

const Button = forwardRef((props, ref) => {

  /**
   * Use new ref if no ref forwarded
   */
  const _ref = useRef()
  const buttonRef = ref ?? _ref

  const { buttonProps } = useButton(props, ref)
  const { children } = props

  const type = props.type ? `tf-button-${props.type}` : ''
  const context = props.context ? `tf-button-is-${props.context}` : ''
  const CustomTag = props.changeTag && props.changeTag == 'span' ? 'span' : 'button'
  
  return (
    <CustomTag 
      className={`${type} ${context}`} 
      style={ props.style } 
      { ...buttonProps } 
      ref={ buttonRef } 
      type='button'
    >
      { children }
    </CustomTag>
  )
})

export default Button
