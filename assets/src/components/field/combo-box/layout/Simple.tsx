import { forwardRef } from 'react'
import { 
  Button,
  Description,
  Label,
  ListBox,
  Popover
} from '../../../base'

import {
  useFocusWithin,
  FocusScope
} from 'react-aria'

/**
 * /!\ This layout does not support multiple values 
 */
const Simple = forwardRef(({
  parent,
  buttonProps,
  descriptionProps,
  labelProps,
  inputProps,
  listBoxProps,
  state,
  multiple = false
}, ref) => {

  if ( multiple ) {
    throw new Error( 'The simple layout does not support multiple values' )
  }

  /**
   * @see https://react-spectrum.adobe.com/react-aria/useFocusWithin.html
   */
  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange: isFocus => {
      parent.onFocusChange ? parent.onFocusChange(isFocus) : false
    }
  })

  return(
    <div className="tf-combo-box" { ...focusWithinProps }>
      { parent.label &&
        <Label labelProps={ labelProps } parent={ parent }>
          { parent.label }
        </Label> }
      <FocusScope autoFocus={ parent.autoFocus } restoreFocus>
        <div className="tf-combo-box-text" ref={ ref.current.wrapper }>
          <input { ...inputProps } ref={ ref.current.input } readOnly={ parent.readOnly } />
          { parent.showButton &&  
            <Button 
              type="action" 
              ref={ ref.current.trigger }
              preventFocusOnPress={ true } 
              { ...buttonProps }
              isDisabled={ parent.readOnly }
            >
              <span aria-hidden="true">
                ▼
              </span>
            </Button> }
          { state.isOpen && ! parent.readOnly &&
            <Popover
              state={ state }
              triggerRef={ ref.current.input }
              popoverRef={ ref.current.popover }
              placement="bottom start"
              isNonModal
              style={{ width: ref.current.wrapper?.current?.offsetWidth }}
              className={ 'tf-combo-box-popover' }
            >
              <ListBox
                loadingState={ parent.loadingState ?? 'idle' }
                listBoxRef={ ref.current.listbox }
                state={ state }
                items={ parent.items }
                focusWithinProps
                shouldUseVirtualFocus
                { ...listBoxProps }
              />
            </Popover> }
        </div>
      </FocusScope>
      { parent.description &&
        <Description descriptionProps={ descriptionProps } parent={ parent }>
          { parent.description }
        </Description> }
    </div>
  )
})

export default Simple
