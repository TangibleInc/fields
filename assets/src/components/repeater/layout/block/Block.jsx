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

  let bulkOptions = []
  bulkOptions['delete'] = 'delete'
  
  if ( useSwitch ) {
    bulkOptions['enabled'] = 'enabled'
    bulkOptions['disabled'] = 'disabled'
  }  

  const isEnabled = ( item, i, value, controlName ) => (
    dispatch({ 
      type    : 'update',
      item    : i,
      control : controlName,
      value   : value
    })
  )

  const handleSelectAll = (value) => {
    if( value !== '0' && value !== false ) {
      setSelectedItems( [...items.map((item) => item)] )
    } else {
      setSelectedItems( [] )
    }
  };

  const handleSelectItem = (value, item) => {
    // let index = items.indexOf(item)
    if ( value === '0' || value === false ) {
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
                isSelected={ item['repeater_switch'] === 'on' || item['repeater_switch'] === true ? true : false } 
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
              choices={ bulkOptions }
              value={ valueSelect }
              onChange={(value) => {
                setValueSelect(value)
              }}
            />
            {
              valueSelect && valueSelect === 'delete' ?
                <ModalTrigger 
                  title="Confirmation"
                  label="Apply"
                  onValidate={ () => {
                    selectedItems.sort((a,b) => {
                      return items.indexOf(a) < items.indexOf(b) ? true : false
                    })
                    selectedItems.map((item) => {
                      let i = items.indexOf(item)
                      dispatch({ 
                        type    : 'remove',
                        item    : i,
                      })
                    })
                    setValueSelect('')
                    setSelectedItems([])
                  } }
                >
                  Are you sure you want to remove selected items?
                </ModalTrigger> : 
                <Button 
                  type="action"
                  onPress={() => {
                    switch (valueSelect) {
                      case 'enabled':
                        selectedItems.map((item) => {
                          let i = items.indexOf(item)
                          isEnabled( item, i, 'on', 'repeater_switch' )
                        })
                        setValueSelect('')
                        setSelectedItems([])
                        break;
    
                      case 'disabled':
                        selectedItems.map((item) => {
                          let i = items.indexOf(item)
                          isEnabled( item, i, 'off', 'repeater_switch' )
                        })
                        setValueSelect('')
                        setSelectedItems([])
                        break;  
                    
                      default:
                        break;
                    }
    
                  }}
                >Apply</Button>
            }
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
              <div className="tf-repeater-block-item-field">
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
