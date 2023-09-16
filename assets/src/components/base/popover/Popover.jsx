import {
  useRef, 
  useContext
} from 'react'

import {
  DismissButton, 
  Overlay, 
  usePopover
} from 'react-aria'

function Popover({ 
  children, 
  state, 
  style,
  className = '',
  ...props 
}) {

  const popoverRef = useRef(null);
  const { popoverProps, underlayProps } = usePopover({
    ...props,
    popoverRef
  }, state);

  /**
   * The Overlay component will create the popover at the end of body, which means
   * we will not be inside the gloabal context class (tf-context-{name})
   * 
   * It needs to be added again in order to correctly apply style inside the popover
   * 
   * @see renderField() in ./src/index.jsx 
   */
  const { ControlContext } = tangibleFields 
  const control = useContext(ControlContext)

  return (
    <Overlay>
      <div className={ control.wrapper }>
        <div {...underlayProps} className="tf-underlay" />
        <div        
          {...popoverProps}
          ref={popoverRef}
          style={{
            ...popoverProps.style,
            ...style,
            boxSizing: 'border-box'
          }}
          className={ `tf-popover ${className}` }
        >
          {children} 
          <DismissButton onDismiss={state.close} />
        </div>
      </div>
    </Overlay>
  );
}

export default Popover;
