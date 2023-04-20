import { useState, useEffect } from 'react'

import { 
  Button, 
  ModalTrigger,
  ExpandablePanel 
} from '../../../base'
import { Checkbox, Switch } from '../../../field'
import Select from '../../../field/select'

const Block = ({
  items,
  dispatch,
  getRow,
  getControl,
  maxLength,
  title = '',
  useSwitch,
  useBulk
}) => {

  const [activeItem, setActiveItem] = useState(0)
  const toggleItem = i => setActiveItem( i !== activeItem ? i : false )
  const [selectedItems, setSelectedItems] = useState([])

  const [valueSelect, setValueSelect] = useState('')

  const isEnabled = ( item, i, value, controlName ) => (
    dispatch({ 
      type    : 'update',
      item    : i,
      control : controlName,
      value   : value
    })
  )

  const handleSelectAll = (value) => {
    if( value !== '0' && value !== false ) setSelectedItems( [...items.map((item) => item)] )
  };

  const handleSelectItem = (value, item) => {
    if ( value === '0' || value === false ) {
      let index = selectedItems.indexOf(item)
      setSelectedItems(selectedItems.filter(id => id !== item))
    } else {
      if( ! selectedItems.includes(item) ) setSelectedItems([...selectedItems, item])
    }
  }

  const getHeaderLeft = ( item, i, activeCheckbox ) => {
    return (
      <>
        {
          useBulk
          ? <div onClick={ e => e.stopPropagation() }>
              <Checkbox value={ activeCheckbox ?? '0' } isSelected={ activeCheckbox === '1' ? true : false } onChange={ value => {
                handleSelectItem(value, item)
              }} />
            </div>  
          : null
        }
        { 
          useSwitch
          ? <div onClick={ e => e.stopPropagation() }>
              <Switch 
                value={ item['repeater_switch'] ?? 'off' } 
                isSelected={ item['repeater_switch'] === 'on' ? true : false } 
                onChange={ value => isEnabled( item, i, value, 'repeater_switch' ) }  
              />
            </div>  
          : null 
        }
      </>
    ) 
  }

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
        <ModalTrigger 
          title="Confirmation"
          label="Remove"
          onValidate={ () => dispatch({ type : 'remove', item : i })}
        >
          Are you sure you want to remove item { i + 1 }?
        </ModalTrigger> }
    </>
  )

  return(
    <div class='tf-repeater-block-items'>
      {
        useBulk ? 
          <>
            <Checkbox value={ '0' } onChange={ (value) => handleSelectAll(value) } />
            <Select
              placeholder="Bulk actions"
              choices={ {
                'enabled': 'enabled',
                'disabled': 'disabled',
                'delete': 'delete'
              } }
              onChange={(value) => {
                setValueSelect(value)
              }}
            />
            <Button 
              onPress={() => {
                switch (valueSelect) {
                  case 'enabled':
                    selectedItems.map((item) => {
                      let i = items.indexOf(item)
                      isEnabled( item, i, 'on', 'repeater_switch' )
                    })
                    setSelectedItems([])
                    break;

                  case 'disabled':
                    selectedItems.map((item) => {
                      let i = items.indexOf(item)
                      isEnabled( item, i, 'off', 'repeater_switch' )
                    })
                    setSelectedItems([])
                    break; 

                  case 'delete':
                    selectedItems.map((item) => {
                      let i = items.indexOf(item)
                      dispatch({ 
                        type    : 'remove',
                        item    : i,
                      })
                    })
                    setSelectedItems([])
                    break; 
                
                  default:
                    break;
                }

              }}
          >Apply</Button>
          </>
        : null
      }
      { items && items.slice(0, maxLength).map((item, i) => (
        <ExpandablePanel
          key={ item.key } 
          title={ title ?? 'Item ' + (i + 1) }
          footer={ actions(i, item) }
          isOpen={ activeItem === i }
          class="tf-repeater-block-item"
          onChange={ visible => visible 
            ? (activeItem !== i ? setActiveItem(i) : null) 
            : (activeItem === i ? setActiveItem(false) : null) }
          headerLeft={ getHeaderLeft( item, i, selectedItems.includes(item) ? '1' : '0' ) }
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
