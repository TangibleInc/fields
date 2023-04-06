import { Button, ModalTrigger } from '../../../base'

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
          </td>
          <td>
            { maxLength !== undefined &&
              <ModalTrigger 
                label="Remove"
                title="Confirmation"
                onValidate={ () => dispatch({ type : 'remove', item : i })}
              >
                Are you sure you want to remove item { i + 1 }?
              </ModalTrigger> }
          </td>
        </tr>
      )) }
    </tbody>
  </table>
)

export default Table
