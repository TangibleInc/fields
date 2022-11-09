import { useRef } from 'react'
import { useListBox } from 'react-aria'

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

  const { 
    listBoxProps, 
    labelProps 
  } = useListBox(props, state, listBoxRef)

  return(
    <>
      <div { ...labelProps }>
        { props.label }
      </div>
      <ul
        { ...listBoxProps }
        ref={ listBoxRef }
        class='tf-list-box'
      >
        { [...state.collection].map(item => (
          item.children
            ? <Section key={ item.key } section={ item } state={ state } />
            : <Option key={ item.key } item={ item } state={ state } />
        )) }
      </ul>
    </>
  );
}

export default ListBox
