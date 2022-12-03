import { 
  useEffect, 
  useReducer,
  useState
} from 'react'

import { 
  repeaterDispatcher, 
  initDispatcher 
} from '../index.js'

import { Button } from '../../base'
import Control from '../../../Control'

const RepeaterList = props => {

  const [activeItem, setActiveItem] = useState(false)
  const toggleItem = i => setActiveItem( i !== activeItem ? i : false )

  const fields = props.fields ?? []

  const rowFields = fields.map(field => {

    const rowField = Object.assign({}, field)
    
    delete rowField.value
    delete rowField.onChange
    
    return rowField
  })
  
  const emptyItem = {}
  fields.forEach(field => emptyItem[ field.name ] = '')

  const [items, dispatch] = useReducer(
    repeaterDispatcher(emptyItem), 
    props.value ?? [],
    initDispatcher
  )

  useEffect(() => props.onChange(items), [items])

  return(
    <div class='tf-repeater-list'>
      <input type='hidden' name={ props.name ?? '' } value={ JSON.stringify(items) } />
      <div class='tf-repeater-list-items'>
        { items && items.map((item, i) => (
          <div key={ item.key } class="tf-repeater-list-item" data-status={ activeItem === i ? 'open' : 'closed' }>
            <div class="tf-repeater-list-item-header" onClick={ () => toggleItem(i) }>
              <strong>Item { i + 1 }</strong>
            </div>
            { activeItem === i && 
              <div class="tf-repeater-list-item-content">
                { rowFields.map(
                  control => ( 
                    <div class="tf-repeater-list-item-field">
                      <Control 
                        value={ item[control.name] ?? '' }
                        onChange={ value => dispatch({ 
                          type    : 'update',
                          item    : i,
                          control : control.name,
                          value   : value
                        }) }
                        { ...control }
                      />
                    </div>  
                  )
                )}
              </div> }
            <div class="tf-repeater-list-item-actions">
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
      <div class="tf-repeater-actions">
        <Button type="action" onPress={ () => dispatch({ type: 'add' }) }>
          Add item
        </Button>
        <Button type="action" onPress={ () => dispatch({ type: 'clear' }) }>
          Clear item
        </Button>
      </div>
    </div>
  )
}

export default RepeaterList
