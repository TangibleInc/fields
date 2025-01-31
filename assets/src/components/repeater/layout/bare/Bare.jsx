const Bare = ({
  items,
  rowFields,
  renderItem,
  maxLength,
  dispatch,
  beforeRow = false,
  afterRow = false,
  renderAction,
  renderFooterActions
}) => (
  <>
    <div className='tf-repeater-items tf-repeater-bare-items'>
      { items && items.slice(0, maxLength).map((item, i) => (
        <div key={ item.key ?? i } className='tf-repeater-bare-row'>
          { beforeRow && beforeRow(item, i, dispatch) }
          { rowFields.map(control => (
            <div key={ control.name ?? i } className="tf-repeater-bare-item-field">
              { renderItem(control, item, i) }
            </div>
          )) }
          { renderAction( 'delete', i ) }
          { afterRow && afterRow(item, i, dispatch) }
        </div>
      )) }
    </div>
    { renderFooterActions() }
  </>
)

export default Bare
