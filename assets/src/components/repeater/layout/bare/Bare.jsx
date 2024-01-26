import { ModalTrigger } from '../../../base'

const Bare = ({
  items,
  rowFields,
  renderType,
  maxLength,
  dispatch,
  beforeRow = false,
  afterRow = false
}) => (
  <div className='tf-repeater-items tf-repeater-bare-items'>
    { items && items.slice(0, maxLength).map((item, i) => (
      <div key={ item.key ?? i } className='tf-repeater-bare-row'>
        { beforeRow && beforeRow(item, i, dispatch) }
        { rowFields.map(control => (
          <div key={ control.name ?? i } className="tf-repeater-bare-item-field">
            { renderType(control, item, i) }
          </div>
        )) }
        { maxLength !== undefined &&
          <ModalTrigger 
            label="Remove"
            title="Confirmation"
            onValidate={ () => dispatch({ type : 'remove', item : i })}
          >
            Are you sure you want to remove item { i + 1 }?
          </ModalTrigger> }
        { afterRow && afterRow(item, i, dispatch) }
      </div>
    )) }
  </div>
)

export default Bare
