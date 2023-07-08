import { useRef } from 'react'
import { useButton } from 'react-aria'

/**
 * @see https://react-spectrum.adobe.com/react-aria/useButton.html
 */

const Button = props => {

  const ref = useRef()
  const { buttonProps } = useButton(props, ref)
  const { children } = props
  
  const type = props.type ? `tf-button-${props.type}` : ''
  const context = props.context ? `tf-button-is-${props.context}` : ''
  const classes = `${type} ${context} ${props.className ?? ''}`
  
  const CustomTag = props.changeTag && props.changeTag == 'span' ? 'span' : 'button'
  
  return (
    <CustomTag className={ classes } style={ props.style } { ...buttonProps } ref={ ref } type='button'>
      { children }
    </CustomTag>
  )
}

export default Button
