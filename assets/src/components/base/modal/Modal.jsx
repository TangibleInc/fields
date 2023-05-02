import { 
  useRef, 
  useContext
} from 'react'

import {
  Overlay,
  useModalOverlay
} from 'react-aria'

const Modal = ({ state, children, ...props }) => {

  /**
   * The Overlay component will create the modal at then end of body, which means
   * we will not be inside the gloabl context class (tf-context-{name})
   * 
   * It needs to be added again in order to correctly apply style inside the modal
   * 
   * @see renderField() in ./src/index.jsx 
   */
  const { ControlContext } = tangibleFields 
  const control = useContext(ControlContext)

  const ref = useRef(null)
  const { modalProps, underlayProps } = useModalOverlay(props, state, ref)

  return (
    <Overlay>
      <div class={ control.wrapper }>
        <div class='tf-modal' { ...underlayProps }>
          <div class='tf-modal-container' ref={ref} {...modalProps}>
            {children}
          </div>
        </div>
      </div>
    </Overlay>
  )
}

export default Modal
