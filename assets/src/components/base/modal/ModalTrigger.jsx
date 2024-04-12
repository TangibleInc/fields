import { useOverlayTriggerState } from 'react-stately'
import { useOverlayTrigger } from 'react-aria'

import { 
  Button, 
  Dialog, 
  Modal 
} from '../../base'

const ModalTrigger = props => {
  
  // Some props names are going to be different when generated from PHP
  const content = props.content ?? props.children
  
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
        { props.label ?? 'Open modal' }
      </Button>
      { state.isOpen &&
        (
          <Modal className="tf-modal" state={state}>
            <Dialog title={ props.title } { ...overlayProps }>
              { content }
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
