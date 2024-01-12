import { 
  useRef,
  forwardRef 
} from 'react'

import { 
  useButton,
  VisuallyHidden
} from 'react-aria'

/**
 * @see https://react-spectrum.adobe.com/react-aria/useButton.html
 */

const Button = forwardRef(({ 
  children,
  ...props 
}, ref) => {

  /**
   * Use new ref if no ref forwarded
   */
  const _ref = useRef()
  const buttonRef = ref ?? _ref

  // Some props names are going to be different when generated from PHP
  const content = props.content ?? children
  const type = props.layout 
    ? (props.layout ? `tf-button-${props.layout}` : '')
    : (props.type ? `tf-button-${props.type}` : '')

  const { buttonProps } = useButton(props, ref)

  const context = props.context ? `tf-button-is-${props.context}` : ''
  const classes = `${type} ${context} ${props.className ?? ''}`
  
  const CustomTag = props.changeTag && props.changeTag == 'span' ? 'span' : 'button'
  
  return (
    <CustomTag 
      className={ classes } 
      style={ props.style } 
      { ...buttonProps } 
      ref={ buttonRef } 
      type='button'
    >
      { props.contentVisuallyHidden
        ? <VisuallyHidden>{ content }</VisuallyHidden>
        : content }
    </CustomTag>
  )
})

export default Button
