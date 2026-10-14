import { Checkbox } from '../../../field'
import BulkActions from '../../common/BulkActions'
import { iconAction } from '../../common/actions'

/**
 * Rows as a real <table>: column labels in <thead>, one <tr> per item. Cells
 * hold the fields with their labels visually hidden (the header carries them)
 *
 * TODO: Implement useTable hook
 *
 * @see https://react-spectrum.adobe.com/react-aria/useTable.html
 */

const Table = ({
  items,
  fields,
  dispatch,
  rowFields,
  renderItem,
  maxLength,
  useBulk,
  renderAction,
  renderFooterActions,
  renderMoveHandle,
  sortable,
  repeatable,
  string
}) => {

  return (
    <>
      { useBulk &&
        <BulkActions
          actions={{ 'deletion': string('bulkDelete') }}
          dispatch={ dispatch }
          string={ string }
        /> }
      <table className="tf-repeater-table-grid">
        <thead>
          <tr>
            { sortable &&
              <th className="tf-repeater-table-handle">
                <span className="tui-visually-hidden">{ string('rowOrder') }</span>
              </th> }
            { useBulk &&
              <th className="tf-repeater-table-select">
                <span className="tui-visually-hidden">{ string('rowSelect') }</span>
              </th> }
            { fields.map((field, h) => (
              <th key={ h }>{ field.label ?? '' }</th>
            )) }
            { repeatable &&
              <th className="tf-repeater-row-actions">
                <span className="tui-visually-hidden">{ string('rowActions') }</span>
              </th> }
          </tr>
        </thead>
        <tbody className='tf-repeater-items tf-repeater-table-items'>
          { items && items.slice(0, maxLength).map((item, i) => (
            <tr key={ item.key }>
              { sortable &&
                <td className="tf-repeater-table-handle">
                  { renderMoveHandle(i, { index: false }) }
                </td> }
              { useBulk &&
                <td className="tf-repeater-table-select">
                  <Checkbox
                    label={ string('selectItem', { index: i + 1 }) }
                    labelVisuallyHidden={ true }
                    value={ item._bulkCheckbox }
                    onChange={ value => dispatch({
                      type    : 'update',
                      item    : i,
                      control : '_bulkCheckbox',
                      value   : value
                    }) }
                  />
                </td> }
              { rowFields.map((control, j) => (
                <td key={ `${item.key}-${j}` }>
                  { renderItem(control, item, i) }
                </td>
              )) }
              { repeatable &&
                <td className='tf-repeater-row-actions'>
                  <div>
                    { renderAction( 'clone', i, iconAction('system/copy', 'secondary') ) }
                    { renderAction( 'delete', i, { buttonProps: iconAction('system/minus', 'danger') } ) }
                  </div>
                </td> }
            </tr>
          )) }
        </tbody>
      </table>
      { renderFooterActions() }
    </>
  )
}

export default Table
