import { iconAction } from '../../common/actions'

/**
 * No chrome: each item is a row of its fields, with Remove at the end and,
 * when sortable, a move handle at the start
 */
const Bare = ({
  items,
  rowFields,
  renderItem,
  maxLength,
  dispatch,
  beforeRow = false,
  afterRow = false,
  renderAction,
  renderMoveHandle,
  renderFooterActions,
  repeatable
}) => (
  <>
    <div className='tf-repeater-items tf-repeater-bare-items'>
      { items && items.slice(0, maxLength).map((item, i) => (
        <div key={ item.key } className='tf-repeater-bare-row'>
          { renderMoveHandle(i, { index: false }) }
          { beforeRow && beforeRow(item, i, dispatch) }
          { rowFields.map(control => (
            <div key={ control.name ?? i } className="tf-repeater-bare-item-field">
              { renderItem(control, item, i) }
            </div>
          )) }
          { repeatable &&
            <div className="tf-repeater-bare-row-actions">
              { renderAction( 'delete', i, { buttonProps: iconAction('system/trash', 'danger', 'ghost') } ) }
            </div> }
          { afterRow && afterRow(item, i, dispatch) }
        </div>
      )) }
    </div>
    { renderFooterActions() }
  </>
)

export default Bare
