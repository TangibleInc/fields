import { useState } from 'react'
import { Button } from '../../../base'
import { Checkbox } from '../../../field'
import BulkActions from '../../common/BulkActions'
import {
  getHeaderConfig,
  renderHeaderValue
} from './header'

const Advanced = ({
  items,
  fields,
  rowFields,
  renderItem,
  maxLength,
  dispatch,
  headerFields = false,
  beforeRow = false,
  afterRow = false,
  renderAction,
  renderFooterActions,
  useBulk
}) => {

  const [openSection, setOpenSection] = useState(false)
  const headerColumns = getHeaderConfig(fields, headerFields)

  return(
    <>
      { useBulk &&
        <BulkActions
          actions={{ 'deletion': 'Delete' }}
          dispatch={ dispatch }
        /> }
      <div className='tf-repeater-advanced'>
        <div className='tf-repeater-advanced-header tf-repeater-advanced-label-row'>
          <div key={ 'index' } className='tf-repeater-advanced-label-row-index'></div>
          { headerColumns.map((column, h) => (
            <div key={ h } className='tf-repeater-advanced-header-item tf-repeater-advanced-label-row-item'>
              { column.label ?? '' }
            </div>
          )) }
          <div key={ 'arrow' } className='tf-repeater-advanced-label-row-arrow'></div>
        </div>
        <div className='tf-repeater-items tf-repeater-advanced-items'>
          { items && items.slice(0, maxLength).map((item, i) => (
            <div 
              key={ item.key ?? i } 
              className="tf-repeater-advanced-item" 
              data-open={ openSection === i ? 'true' : 'false' }
            >
              <div className='tf-repeater-advanced-overview tf-repeater-advanced-label-row'>
                { useBulk &&
                  <div
                    className="tf-repeater-advanced-item-checkbox"
                    onClick={ e => e.stopPropagation() }
                  >
                    <Checkbox
                      label={ `Select item ${i + 1}` }
                      labelVisuallyHidden={ true }
                      value={ item._bulkCheckbox }
                      onChange={ value => dispatch({
                        type    : 'update',
                        item    : i,
                        control : '_bulkCheckbox',
                        value   : value
                      }) }
                    />
                  </div> }
                <div key={ 'index' } className='tf-repeater-advanced-label-row-index'>
                  { i + 1 }
                </div>
                <div className="tf-repeater-advanced-overview-item-container">
                  <div className="tf-repeater-advanced-overview-item-fields">
                    { headerColumns.map((column, columnKey) => (
                      <div
                        key={ columnKey }
                        className='tf-repeater-advanced-overview-item tf-repeater-advanced-label-row-item'
                      >
                        { renderHeaderValue(column, item) }
                      </div>
                    )) }
                  </div>
                  { maxLength !== undefined &&
                    <div className="tf-repeater-advanced-overview-item-actions">
                      <Button
                        type="text-primary"
                        onPress={ () => setOpenSection(openSection === i ? false : i) }
                      >
                        { openSection === i ? 'Close' : 'Edit' }
                      </Button>
                      { renderAction( 'clone', i, { type : 'text-primary' } ) }
                      { renderAction( 'delete', i, { buttonProps : { type: 'text-danger' } } ) }
                    </div> } 
                </div>
                <Button
                  key={ 'arrow' } 
                  type="repeater-overview-open" 
                  onPress={ () => setOpenSection(openSection === i ? false : i) }
                  changeTag={ 'span' }
                  className={ 'tf-repeater-advanced-label-row-arrow' }
                >
                  <div></div>
                </Button>
              </div>
              { openSection === i && <div className='tf-repeater-advanced-row'>
                { beforeRow && beforeRow(item, i, dispatch) }
                { rowFields.map(control => (
                  <div key={ control.name ?? i } className="tf-repeater-advanced-item-field">
                    { renderItem(control, item, i) }
                  </div>
                )) }
                { afterRow && afterRow(item, i, dispatch) }
              </div> }
            </div>
          )) }
        </div>
      </div>
      { renderFooterActions() }
    </>
  )
}

export default Advanced
