import { useEffect, useReducer } from 'react'
import { ActionButton } from '@adobe/react-spectrum' 
import { repeaterDispatcher, initDispatcher } from '../index.js'

import Control from '../../../Control'

const Repeater = props => {

  const fields = props.fields ?? []

  const rowFields = fields.map(field => {

    const rowField = Object.assign({}, field)
    
    delete rowField.label
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

  /**
   * We can't use the react-spectrum TableView component for now, because there is an issue
   * that prevent item inside a row to be focused 
   * 
   * They are aware of the issue, but the fix is planned for 2023, so we will use a regular 
   * table for now
   * 
   * @see https://react-spectrum.adobe.com/react-spectrum/TableView.html
   * @see https://github.com/adobe/react-spectrum/issues/2328
   * 
   * import { ... } '@react-spectrum/table'
   * 
   * <TableView>
   *  <TableHeader>
   *    <Column></Column>
   *  </TableHeader>
   *  <TableBody>
   *    <Row>
   *      <Cell></Cell>  
   *    </Row>
   *  </TableBody>
   * </TableView>
   */
  
  return(
    <>
      <input type='hidden' name={ props.name ?? '' } value={ JSON.stringify(items) } />
      <table class='tangible-field-table-repeater'>
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
                <ActionButton onPress={ () => dispatch({ type: 'remove', item: i }) }>
                  Remove
                </ActionButton>
              </td>
            </tr>
          )) }
        </tbody>
      </table>
      <ActionButton onPress={ () => dispatch({ type: 'add' }) }>
        Add item
      </ActionButton>
      <ActionButton onPress={ () => dispatch({ type: 'clear' }) }>
        Clear item
      </ActionButton>
   </>
  )
}

export default Repeater
