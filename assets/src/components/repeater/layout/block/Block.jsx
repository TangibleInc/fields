import { useState } from 'react'
import { Button, ModalTrigger } from '../../../base'

const Block = ({
  items,
  dispatch,
  getRow,
  getControl,
  maxLength
}) => {

  const [activeItem, setActiveItem] = useState(0)
  const toggleItem = i => setActiveItem( i !== activeItem ? i : false )

  return(
    <div class='tf-repeater-block-items'>
      { items && items.slice(0, maxLength).map((item, i) => (
        <div key={ item.key } class="tf-repeater-block-item" data-status={ activeItem === i ? 'open' : 'closed' }>
          <div class="tf-repeater-block-item-header" onClick={ () => toggleItem(i) }  aria-controls={`itemId-${i}`} aria-expanded={activeItem === i} >
            <strong>Item { i + 1 }</strong>
          </div>
          { activeItem === i && 
            <div class="tf-repeater-block-item-content" id={`itemId-${i}`} aria-label={`Item ${i+1} details`} >{ 
              getRow(item).map(
                control => ( 
                  <div class="tf-repeater-block-item-field">
                    { getControl(control, item, i) }
                  </div>  
                )
              )}
            </div> }
          <div class="tf-repeater-block-item-actions">
            { maxLength !== undefined &&
              <Button
                type="action"
                isDisabled={ maxLength <= items.length }
                onPress={() => dispatch({ 
                  type    : 'clone',
                  item    : item
                })}
              >
                Clone
              </Button> }
            <Button type="action" onPress={ () => toggleItem(i) }>
              { activeItem !== i ? 'Edit' : 'Close' }
            </Button>
            { maxLength !== undefined && (
              <ModalTrigger 
                btnLabel="Remove"
                message={ `Are you sure you want to remove item ${ i + 1 }?` }
                dispatch={ dispatch }
                dispatchItem= {{ type : 'remove', item : i }}
                >
              </ModalTrigger>
            )}
          </div>
        </div>
      )) }
    </div>
  )
}

export default Block
