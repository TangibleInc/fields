import { useState } from 'react'
import { Button, ExpandablePanel } from '../../../base'

const Block = ({
  items,
  dispatch,
  getRow,
  getControl,
  maxLength
}) => {

  const [activeItem, setActiveItem] = useState(0)
  const toggleItem = i => setActiveItem( i !== activeItem ? i : false )

  const actions = i => (
     <> 
      <Button type="action" onPress={ () => toggleItem(i) }>
        { activeItem !== i ? 'Edit' : 'Close' }
      </Button>
      { maxLength !== undefined && 
        <Button type="action" onPress={ () => dispatch({ type: 'remove', item: i }) }>
          Remove
        </Button> }
    </>
  )

  return(
    <div class='tf-repeater-block-items'>
      { items && items.slice(0, maxLength).map((item, i) => (
        <ExpandablePanel
          key={ item.key } 
          title={ 'Item ' + (i + 1) }
          footer={ actions(i) }
          isOpen={ activeItem === i }
          class="tf-repeater-block-item"
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
