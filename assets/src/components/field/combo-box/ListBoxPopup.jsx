import {  
  DismissButton,
  mergeProps,
  useOverlay,
  useListBox, 
} from 'react-aria'

import { 
  Option, 
  Section 
} from '../../base/'

/**
 * Maybe should try to use same component than for select instead (base/list-box) 
 */

const ListBoxPopup = props => {

  const {
    popoverRef,
    listBoxRef,
    state,
    shouldUseVirtualFocus,
    ...otherProps
  } = props

  const { listBoxProps } = useListBox({
    autoFocus: state.focusStrategy,
    disallowEmptySelection: true,
    shouldUseVirtualFocus, // Needed to prevent focus moving on listbox
    ...otherProps
  }, state, listBoxRef)

  /**
   * Manage events that should cause the popup to close
   * 
   * @see https://react-spectrum.adobe.com/react-aria/useOverlay.html
   */
  const { overlayProps } = useOverlay({
    onClose: state.close,
    shouldCloseOnBlur: true,
    isOpen: state.isOpen,
    isDismissable: true
  }, popoverRef)

  /**
   * Hidden <DismissButton> component at the end to allow screen reader 
   * users to dismiss the popup easily
   * 
   * @see https://react-spectrum.adobe.com/react-aria/DismissButton.html
   */

  return (
    <div class="tf-combo-box-popover" { ...overlayProps } ref={ popoverRef }>
      <ul
        { ...mergeProps(listBoxProps, otherProps) }
        ref={ listBoxRef }
        class="tf-combo-box-list"
      >
        { [...state.collection].map(item => (
          item.type === 'section'
            ? <Section key={ item.name } section={ item } state={ state } shouldUseVirtualFocus />
            : <Option key={ item.id ?? item.name } item={ item } state={ state } shouldUseVirtualFocus />
        )) }
      </ul>
      <DismissButton onDismiss={ state.close } />
    </div>
  )
}

export default ListBoxPopup
