import { useRef } from 'react'
import { useDialog } from 'react-aria'

/**
 * @see https://react-spectrum.adobe.com/react-aria/useDialog.html 
 */

const Dialog = ({ title, children, ...props }) => {

  const ref = useRef()
  const { dialogProps } = useDialog(props, ref)

  return(
    <div { ...dialogProps } ref={ ref }>
      { children }
    </div>
  )
}

export default Dialog
