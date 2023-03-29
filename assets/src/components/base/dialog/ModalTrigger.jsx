import {Overlay, useModalOverlay, useOverlayTrigger} from 'react-aria'
import {useOverlayTriggerState} from 'react-stately'
import { useState } from 'react'
import { Button, Dialog, Title } from '../../base'

const Modal = ({ state, children, ...props }) => {
  let ref = React.useRef(null)
  let { modalProps, underlayProps } = useModalOverlay(props, state, ref)

  return (
    <Overlay>
      <div
        style={{
          position: 'fixed',
          zIndex: 100,
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        {...underlayProps}
      >
        <div
          {...modalProps}
          ref={ref}
          style={{
            padding: '2rem',
            borderRadius: '3px',
            background: 'white',
            border: '1px solid rgba(0,0,0,0.2)',
            textAlign: 'end',
          }}
        >
          {children}
        </div>
      </div>
    </Overlay>
  )
}

const ModalTrigger = ({ dispatch, ...props }) => {
  let state = useOverlayTriggerState(props)
  const [ showModal, setShowModal ] = useState(false)

  const style = {
    width: 'fit-content',
    background: 'white',
    border: 'solid 1px #d3d3d3',
    fontSize: '14px',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#505050',
    padding: '0 12px',
    height: 'calc(32px - 2px)',
    outline: 'none'
  }

  return (
    <>
      <Button 
        type="action" 
        isDisabled={ props.isDisabled } 
        onPress={() => setShowModal(true) }
      >
        {props.btnLabel}
      </Button>
      { showModal &&
        (
          <Modal state={state}>
            <Dialog title="Confirmation Dialog">
              <Title level={4} className='tf-repeater-title'> { props.message } </Title>
              <Button
                type="action"
                style={ style }
                onPress={() => setShowModal(false) }
              >
                Cancel
              </Button>
              <Button
                type="action"
                style={ style }
                onPress={() => {
                  setShowModal(false)
                  dispatch( props.dispatchItem )
                }}
              >
                {props.btnLabel}
              </Button>
            </Dialog>
          </Modal>
        )
      }
    </>
  )
}

export default ModalTrigger
