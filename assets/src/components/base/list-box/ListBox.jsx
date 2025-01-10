import { useRef } from 'react'

import { 
  useListBox,
  DismissButton
} from 'react-aria'

import Option from './Option'
import Section from './Section'

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
  const { listBoxRef = ref, state } = props

  const { listBoxProps } = useListBox(props, state, listBoxRef)

  /**
   * Hidden <DismissButton> component at the end to allow screen reader 
   * users to dismiss the popup easily
   * 
   * @see https://react-spectrum.adobe.com/react-aria/DismissButton.html
   */

  return(
    <>
      <ul
        { ...listBoxProps }
        ref={ listBoxRef }
        className='tf-list-box'
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
                  shouldUseVirtualFocus 
                />
            )) }
      </ul>
      <DismissButton onDismiss={ state.close } />
    </>
  )
}

export default ListBox
