import { useRef } from 'react'

import { 
  useListBox,
  DismissButton
} from 'react-aria'

import Option from './Option'
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

const CheckboxListBox = props => {

    let state = useListState(props)
    const ref = useRef()
    const { listBoxRef = ref } = props
    
    const { listBoxProps } = useListBox(props, state, ref)

return (
    <ul
    { ...listBoxProps }
    ref={ listBoxRef }
    className='tf-list-box'
    >
        {[...state.collection].map(item => (
            <Option 
                    key={ item.key ?? item.name } 
                    item={ item } 
                    state={ state } 
                    shouldUseVirtualFocus 
            />
        )) }
    </ul>
)
}

export default CheckboxListBox
