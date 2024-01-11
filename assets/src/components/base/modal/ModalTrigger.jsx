import { useOverlayTriggerState } from 'react-stately'
import { useOverlayTrigger } from 'react-aria'

import { 
  Button, 
  Dialog, 
  Modal 
} from '../../base'

const ModalTrigger = props => {
  
  const state = useOverlayTriggerState(props)
  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type: 'dialog' },
    state
  )

  return (
    <>
      <Button 
        { ...triggerProps }
        type="action"
        isDisabled={ props.isDisabled }
        { ...(props.buttonProps ?? {}) }
      >
        { props.label }
      </Button>
      { state.isOpen &&
        (
          <Modal className="tf-modal" state={state}>
            <Dialog title={ props.title } { ...overlayProps }>
              { props.children }
              <div className="tf-modal-actions">
                <Button
                  type="danger"
                  onPress={() => {
                    state.close()
                    if( props.onValidate ) props.onValidate()
                  }}
                >
                  { props.confirmText ?? props.label }
                </Button>
                <Button
                  type="action"
                  onPress={() => {
                    state.close()
                    if( props.onCancel ) props.onCancel()
                  }}
                >
                  { props.cancelText ?? 'Cancel' }
                </Button>
              </div>
            </Dialog>
          </Modal>
        )
      }
    </>
  )
}

export default ModalTrigger
