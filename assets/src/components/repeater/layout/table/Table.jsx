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
  getControl,
  maxLength
}) => (
  <table>
    <thead>
      <tr>
        { fields.map(field => (
          <th>{ field.label ?? '' }</th>
        )) }
        { maxLength > 1 && <th align='end'></th>}
      </tr>
    </thead>
    <tbody>
      { items && items.slice(0, maxLength).map((item, i) => (
        <tr key={ item.key }>{ 
          getRow(item).map(
            control => (
              <td>{ getControl(control, item, i) }</td>  
            )
          )}
          <td>
            { maxLength > 1 && (
                <Button type="action" onPress={ () => dispatch({ type: 'remove', item: i }) }>
                  Remove
                </Button>
            )}
          </td>
        </tr>
      )) }
    </tbody>
  </table>
)

export default Table
