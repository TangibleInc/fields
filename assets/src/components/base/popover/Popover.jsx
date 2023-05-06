import { forwardRef } from 'react'

import {
  DismissButton,
  FocusScope,
  mergeProps,
  useDialog,
  useModal,
  useOverlay,
} from 'react-aria'

const Popover = forwardRef(({
  title,
  children,
  isOpen,
  onClose,
  style,
  ...otherProps
}, ref) => {

  const { overlayProps } = useOverlay({
    onClose,
    isOpen,
    isDismissable: true
  }, ref)

  const { modalProps } = useModal()
  const { dialogProps } = useDialog({}, ref)

  return (
    <FocusScope restoreFocus autoFocus>
      <div
        { ...mergeProps(
          overlayProps, 
          dialogProps, 
          otherProps, 
          modalProps
        ) }
        ref={ ref }
        style={ style }
        className="tf-popover"
      >
        { children }
        <DismissButton onDismiss={ onClose } />
      </div>
    </FocusScope>
  )
})

export default Popover
