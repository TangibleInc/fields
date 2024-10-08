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
  renderItem,
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
        { useBulk && <th></th> }
        { fields.map((field, h) => (
          <th key={ h }>{ field.label ?? '' }</th>
        )) }
        { maxLength > 1 && <th align='end'></th>}
      </tr>
    </thead>
    <tbody className='tf-repeater-items tf-repeater-table-items'>
      { items && items.slice(0, maxLength).map((item, i) => (
        <tr key={ item.key ?? i }>
          { useBulk &&
            <td key={ `${item.key}-enable` }>
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
              </div>
            </td> }
          { rowFields.map((control, j) => (
            <td key={ `${item.key}-${j}` }>
              { renderItem(control, item, i) }
            </td>
          )) }
          <td className='tf-repeater-row-actions'>
            <div>
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
              { maxLength !== undefined &&
                <ModalTrigger
                  label="Remove"
                  title="Confirmation"
                  onValidate={ () => dispatch({ type : 'remove', item : i })}
                  buttonProps={{
                    type: 'danger'
                  }}
                >
                  Are you sure you want to remove item { i + 1 }?
                </ModalTrigger> }
              </div>
          </td>
        </tr>
      )) }
    </tbody>
  </table>
  </div>
)

export default Table
