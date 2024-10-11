import { useRef } from 'react'

import { 
  useListBox,
  DismissButton,
  useGridList
} from 'react-aria'

import Option from './Option'
import Section from './Section'
import { useListState } from 'react-stately'

/**
 * <ListBox label='Alignment' selectionMode='single'>
 *   <Item>Left</Item>
 *   <Item>Middle</Item>
 *   <Item>Right</Item>
 * </ListBox>
 * 
 * @see https://react-spectrum.adobe.com/react-aria/useListBox.html
 */

const ListBox = props => {

  const ref = useRef()
  const listBoxRef = props.listBoxRef || ref

  const isCheckbox = props?.type === 'checkbox'
  const state = isCheckbox ? useListState(props) : props.state

  const { listBoxProps } = useListBox(props, state, listBoxRef)
  let { gridProps } = useGridList(props, state, ref)

  /**
   * Hidden <DismissButton> component at the end to allow screen reader 
   * users to dismiss the popup easily
   * 
   * @see https://react-spectrum.adobe.com/react-aria/DismissButton.html
   */
 
  return(
    <>
      <ul
        { ...(isCheckbox ? gridProps : listBoxProps) }
        ref={ listBoxRef }
        className={`tf-list-box ${isCheckbox && 'tf-list-checkbox'}`}
      >
        { ['loading', 'filtering'].includes(props?.loadingState)
          ? <Option 
              key={ '_loading' } 
              state={ state }
              item={{ 
                rendered: 'Loading...', 
                isDisabled: true 
              }} 
              shouldUseVirtualFocus 
            />
          : [...state.collection].map(item => (
              item.type === 'section'
              ? <Section 
                  key={ item.key ?? item.level } 
                  section={ item } 
                  state={ state } 
                  shouldUseVirtualFocus 
                />
              : <Option 
                  key={ item.key ?? item.name } 
                  item={ item } 
                  state={ state } 
                  hasCheckbox={ isCheckbox }  
                  shouldUseVirtualFocus 
              />
            )) }
      </ul>
      <DismissButton onDismiss={ state.close } />
    </>
  );
}

export default ListBox
