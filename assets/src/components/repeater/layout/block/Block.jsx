import { useState } from 'react'

import { 
  Button, 
  ModalTrigger,
  ExpandablePanel 
} from '../../../base'

const Block = ({
  items,
  dispatch,
  getRow,
  getControl,
  maxLength
}) => {

  const [activeItem, setActiveItem] = useState(0)
  const toggleItem = i => setActiveItem( i !== activeItem ? i : false )

  const actions = (i, item) => (
     <> 
      { maxLength !== undefined &&
        <Button
          type="action"
          isDisabled={ maxLength <= items.length }
          onPress={() => dispatch({ 
            type : 'clone',
            item : item
          })}
        >
          Clone
        </Button> }
      <Button type="action" onPress={ () => toggleItem(i) }>
        { activeItem !== i ? 'Edit' : 'Close' }
      </Button>
      { maxLength !== undefined && 
        <Button type="action" onPress={ () => dispatch({ type: 'remove', item: i }) }>
          Remove
        </Button> }
      { maxLength !== undefined && 
        <ModalTrigger 
          btnLabel="Remove"
          message={ `Are you sure you want to remove item ${ i + 1 }?` }
          dispatch={ dispatch }
          dispatchItem= {{ type : 'remove', item : i }}
        /> }
    </>
  )

  return(
    <div class='tf-repeater-block-items'>
      { items && items.slice(0, maxLength).map((item, i) => (
        <ExpandablePanel
          key={ item.key } 
          title={ 'Item ' + (i + 1) }
          footer={ actions(i, item) }
          isOpen={ activeItem === i }
          class="tf-repeater-block-item"
          onChange={ visible => visible 
            ? (activeItem !== i ? setActiveItem(i) : null) 
            : (activeItem === i ? setActiveItem(false) : null) }
        > 
          { getRow(item).map(
            control => ( 
              <div class="tf-repeater-block-item-field">
                { getControl(control, item, i) }
              </div>  
            ) 
          ) } 
        </ExpandablePanel>
      )) }
    </div>
  )
}

export default Block
