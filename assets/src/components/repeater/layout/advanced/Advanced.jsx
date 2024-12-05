import { useState } from 'react'
import { 
  ModalTrigger,
  Button
} from '../../../base'

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
  renderFooterActions
}) => {

  const [openSection, setOpenSection] = useState(false)
  const headerColumns = headerFields
    ? fields.filter(field => headerFields.includes(field.name) || headerFields.includes(field.name + '.label') )
    : fields

  // This function is here to add future format. 
  // Maybe we'll need to add more context for the header in the future, and not all of them will have a label.
  const formatHeaderFieldsObject = (item, columnName) => {
    return item[columnName].label === '' ? JSON.stringify(item[ columnName ]) : item[columnName].label
  }
  
  return(
    <>
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
                <div key={ 'index' } className='tf-repeater-advanced-label-row-index'>
                  { i + 1 }
                </div>
                <div className="tf-repeater-advanced-overview-item-container">
                  <div className="tf-repeater-advanced-overview-item-fields">
                    { headerColumns.map((column, h) => (
                      <div key={ h } className='tf-repeater-advanced-overview-item tf-repeater-advanced-label-row-item'>
                        { item[ column.name ] && item[ column.name ] !== '' 
                          ? (
                            typeof item[ column.name ] === 'object' 
                              ? formatHeaderFieldsObject(item, column.name)
                              : item[ column.name ]
                            )
                          : <i>Empty</i> }
                      </div>
                    )) }
                  </div>
                  { maxLength !== undefined &&
                    <div className="tf-repeater-advanced-overview-item-actions">
                      <Button type="text-primary" onPress={ () => setOpenSection(openSection === i ? false : i) }>
                        { openSection === i ? 'Close' : 'Edit' } 
                      </Button>
                      <Button 
                        type="text-primary" 
                        isDisabled={ maxLength <= items.length }
                        onPress={() => dispatch({ 
                          type : 'clone',
                          item : item
                        })}
                      >
                        Duplicate
                      </Button>
                      <ModalTrigger 
                        label="Delete"
                        title="Confirmation"
                        onValidate={ () => dispatch({ type : 'remove', item : i })}
                        buttonProps={{ type: 'text-danger' }}
                      >
                        Are you sure you want to remove item { i + 1 }?
                      </ModalTrigger>
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
