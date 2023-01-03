import { useRef } from 'react'
import { useButton } from 'react-aria'

/**
 * @see https://react-spectrum.adobe.com/react-aria/useButton.html
 */

const Button = props => {

  const ref = useRef()
  const { buttonProps } = useButton(props, ref)
  const { children } = props
  
  return (
    <span class={ props.type ? `tf-button-${props.type}` : ''} { ...buttonProps } ref={ ref }>
      { children }
    </span>
  )
}

export default Button
