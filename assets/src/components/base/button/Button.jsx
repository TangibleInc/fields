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
    <button { ...buttonProps } ref={ ref }>
      { children }
    </button>
  )
}

export default Button
