import { Button } from '../../../base'

/**
 * TODO: Implement useTable hook
 *  
 * @see https://react-spectrum.adobe.com/react-aria/useTable.html 
 */

const Table = ({
  items,
  fields,
  dispatch,
  getRow,
  getControl
}) => (
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
        <tr key={ item.key }>{ 
          getRow(item).map(
            control => (
              <td>{ getControl(control, item, i) }</td>  
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
)

export default Table
