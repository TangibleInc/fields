import { Button, ModalTrigger } from '../../../base'
import { Checkbox } from '../../../field'
import BulkActions from '../../common/BulkActions'

/**
 * TODO: Implement useTable hook
 *  
 * @see https://react-spectrum.adobe.com/react-aria/useTable.html 
 */

const bulkOptions = { 'deletion': 'Delete' }

const Table = ({
  items,
  fields,
  dispatch,
  rowFields,
  getControl,
  maxLength,
  useBulk
}) => (
  <div>
  { useBulk && 
    <BulkActions
      actions={ bulkOptions }
      dispatch={ dispatch }
    /> } 
  <table>
    <thead>
      <tr>
        <th></th>
        { fields.map((field, h) => (
          <th key={ h }>{ field.label ?? '' }</th>
        )) }
        { maxLength > 1 && <th align='end'></th>}
      </tr>
    </thead>
    <tbody>
      { items && items.slice(0, maxLength).map((item, i) => (
        <tr key={ item.key ?? i }>
          <td key={ `${item.key}-enable` }>
            { useBulk && 
              <div onClick={ e => e.stopPropagation() }>
                <Checkbox 
                  value={ item._bulkCheckbox }
                  onChange={ value => dispatch({ 
                    type    : 'update',
                    item    : i,
                    control : '_bulkCheckbox',
                    value   : value
                  }) } 
                />
              </div> }
          </td>
          { rowFields.map((control, j) => (
            <td key={ `${item.key}-${j}` }>
              { getControl(control, item, i) }
            </td>
          )) }
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
  </div>
)

export default Table
