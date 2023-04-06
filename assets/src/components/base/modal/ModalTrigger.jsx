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
      >
        { props.label }
      </Button>
      { state.isOpen &&
        (
          <Modal class="tf-modal" state={state}>
            <Dialog title={ props.title } { ...overlayProps }>
              { props.children }
              <div class="tf-modal-actions">
                <Button
                  type="action"
                  onPress={() => {
                    state.close()
                    props.onValidate()
                  }}
                >
                  { props.label }
                </Button>
                <Button
                  type="action"
                  onPress={ state.close }
                >
                  Cancel
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
