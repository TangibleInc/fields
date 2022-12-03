import { 
  useEffect, 
  useReducer 
} from 'react'

import { 
  repeaterDispatcher, 
  initDispatcher 
} from '../index.js'

import { Button } from '../../base'
import Control from '../../../Control'

/**
 * TODO: Implement useTable hook
 *  
 * @see https://react-spectrum.adobe.com/react-aria/useTable.html 
 */
const RepeaterTable = props => {

  const fields = props.fields ?? []

  const rowFields = fields.map(field => {

    const rowField = Object.assign({}, field)
    
    delete rowField.label
    delete rowField.description
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
    <div class='tf-repeater-table'>
      <input type='hidden' name={ props.name ?? '' } value={ JSON.stringify(items) } />
      <table>
        <thead>
          <tr>
            { fields.map(field => (
              <th>{ field.label ?? '' }</th>
            )) }
            <th align='end'></th>
          </tr>
        </thead>
        <tbody>
          { items && items.map((item, i) => (
            <tr key={ item.key }>
              { rowFields.map(
                control => ( 
                  <td>
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
                  </td>  
                )
              )}
              <td>
                <Button type="action" onPress={ () => dispatch({ type: 'remove', item: i }) }>
                  Remove
                </Button>
              </td>
            </tr>
          )) }
        </tbody>
      </table>
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

export default RepeaterTable
