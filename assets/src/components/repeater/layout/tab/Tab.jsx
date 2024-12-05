import { useState } from 'react' 
import { Button, ModalTrigger } from '../../../base'
import { renderTitle } from '../../common/helpers'

const Tab = ({
  items,
  rowFields,
  renderItem,
  maxLength,
  dispatch,
  name,
  title = false,
  beforeRow = false,
  afterRow = false
}) => {

  const [activeItem, setActiveItem] = useState(0)

  return(
    <div className='tf-repeater-tab-container'>
      <div className='tf-repeater-tab-header'>
      <div className='tf-repeater-items tf-repeater-tab-items'>
          { items && items.slice(0, maxLength).map((item, i) => (
            <div 
              key={ item.key ?? i } 
              className='tf-repeater-tab-item'
              data-open={ activeItem == i }
            >
              <Button type={ 'text-action' } onPress={ () => setActiveItem(i) }>
                { renderTitle(item, i, title, name, renderItem) }
              </Button>
            </div>
          )) }
        </div>
        <div className='tf-repeater-tab-actions'>
          <div className='tf-repeater-tab-add-item'>
            <Button
              type={ 'text-primary' }
              onPress={ () => dispatch({ type: 'add' }) } 
              isDisabled={ maxLength <= items.length }
            >
              + Add Item
            </Button>
          </div>
          <div className='tf-repeater-tab-icon-actions'>
            { maxLength !== undefined &&
              <ModalTrigger 
                label="Remove"
                title="Confirmation"
                onValidate={ () => {
                  dispatch({ type : 'remove', item : activeItem })
                  setActiveItem( activeItem == 0 ? 0 : activeItem - 1 )
                } }
                buttonProps={ {
                  type                  : 'icon-trash',
                  contentVisuallyHidden : true
                } }
              >
                Are you sure you want to remove item { activeItem + 1 }?
              </ModalTrigger> }
          </div>
        </div>
      </div>
      { items[ activeItem ] && 
        <div className='tf-repeater-tab-content'>
          <div key={ items[ activeItem ].key ?? activeItem } className='tf-repeater-tab-row'>
            { beforeRow && beforeRow(items[ activeItem ], activeItem, dispatch) }
            { rowFields.map(control => (
              <div key={ control.name ?? activeItem } className="tf-repeater-tab-item-field">
                { renderItem(control, items[ activeItem ], activeItem) }
              </div>
            )) }
            { afterRow && afterRow(items[ activeItem ], activeItem, dispatch) }
          </div>
        </div> }
    </div>
  )
}

export default Tab
