import { useState } from 'react'
import { Button } from '../../../base'

const Block = ({
  items,
  dispatch,
  getRow,
  getControl
}) => {

  const [activeItem, setActiveItem] = useState(false)
  const toggleItem = i => setActiveItem( i !== activeItem ? i : false )

  return(
    <div class='tf-repeater-block-items'>
      { items && items.map((item, i) => (
        <div key={ item.key } class="tf-repeater-block-item" data-status={ activeItem === i ? 'open' : 'closed' }>
          <div class="tf-repeater-block-item-header" onClick={ () => toggleItem(i) }>
            <strong>Item { i + 1 }</strong>
          </div>
          { activeItem === i && 
            <div class="tf-repeater-block-item-content">{ 
              getRow(item).map(
                control => ( 
                  <div class="tf-repeater-block-item-field">
                    { getControl(control, item, i) }
                  </div>  
                )
              )}
            </div> }
          <div class="tf-repeater-block-item-actions">
            <Button type="action" onPress={ () => toggleItem(i) }>
              { activeItem !== i ? 'Edit' : 'Close' }
            </Button>
            <Button type="action" onPress={ () => dispatch({ type: 'remove', item: i }) }>
              Remove
            </Button>
          </div>
        </div>
      )) }
    </div>
  )
}

export default Block