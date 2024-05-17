import { 
  useEffect, 
  useReducer,
  useState,
  useRef
} from 'react'

import { 
  repeaterDispatcher, 
  initDispatcher 
} from './dispatcher.js'

import { 
  Button, 
  Title, 
  ModalTrigger 
} from '../base'

import Layouts from './layout' 
import Item from './common/Item'

const Repeater = props => {

  const fields = props.fields ?? []

  const layout = props.layout ?? 'table'
  const Layout = Layouts[ layout ]

  const repeatable = props.repeatable ?? true
  const maxLength = props.maxlength ?? Infinity

  const rowFields = fields.map(field => {

    const rowField = Object.assign({}, field)
    
    if( layout === 'table' ) {
      /**
       * As label/description is not visibile in table cell but still needs to be set for accesibility 
       */
      rowField.labelVisuallyHidden = true
      rowField.descriptionVisuallyHidden = true
    }
    
    delete rowField.value
    delete rowField.onChange
    
    return rowField
  })
  
  const emptyItem = {}
  fields.forEach(field => emptyItem[ field.name ] = '')

  const [items, dispatch] = useReducer(
    repeaterDispatcher(emptyItem, maxLength), 
    props.value ?? '',
    initDispatcher
  )

  const hasField = name => (
    rowFields.map(
      field => field.name ?? false
    ).includes(name)
  )

  /**
   * Can be used by repeater sub-controls to watch value change from the current row/block
   */
  const [onChangeCallback, setChangeCallback] = useState([])

  /**
   * Call all the visibility callback attached to data.watcher (@see <Control /> below)
   */
  const triggerRowCallbackEvents = (rowKey, fieldName) => {
    onChangeCallback.forEach(callback => callback(rowKey, fieldName))
  }

  /**
   * Not sure why, but without a ref the state value is always empty when used inside getValue()
   */
  const values = useRef()
  values.current = items

  const renderItem = (config, row, i) => (
    <Item
      key={ row.key + i }
      values={ row }
      config={ config }
      onChange={ value => dispatch({ 
        type     : 'update',
        item     : i,
        control  : config.name,
        value    : value,
        callback : () => triggerRowCallbackEvents(row.key, config.name)
      }) }
      /**
       * Used by visbility and dependent values to detect changes and access data 
       */
      data={{
        /**
         * The field value can either be from a subvalue or from the parent getter if no match
         */
        getValue: name => (
          hasField(name)
            ? (values.current[i][name] ?? '') 
            : (props.data.getValue(name ?? ''))
        ),
        /**
         * Possibility to add callback event that will be triggered each time a field from the current row will
         * change
         * @todo Avoid multiple definition (currently no way to remove watch from child which not ideal)
         */
        watcher: callback => setChangeCallback(
          prevValue => [ 
            ...prevValue,
            (rowKey, fieldName) => {
              rowKey === row.key && config.name 
                ? callback(fieldName, row.key) 
                : null
            } 
          ]
        )
      }}
    />
  )
  
  /**
   * There are some values we don't want to save (like the bulk action checbox)
   */
  const getSavedValue = () => (
    items.map(
      ({
        _bulkCheckbox, 
        ...item
      }) => item
    )
  )

  useEffect(() => props.onChange && props.onChange( getSavedValue() ), [items])

  return(
    <div className={ `tf-repeater tf-repeater-${layout}`}>
      <input type='hidden' name={ props.name ?? '' } value={ JSON.stringify(getSavedValue()) } />
      { props.label && 
        <Title level={2} className='tf-repeater-title'>
          { props.label }
        </Title> }
      <div className={ `tf-repeater-container tf-repeater-${layout}-container` }>
        <Layout
          items={ items }
          fields={ fields }
          dispatch={ dispatch }
          rowFields={ rowFields }
          headerFields={ props.headerFields }
          renderItem={ renderItem }
          maxLength = { repeatable ? maxLength : undefined }
          title={ props.sectionTitle ?? false }
          useSwitch={ props.useSwitch }
          useBulk={ props.useBulk }
          afterRow={ props.afterRow }
          beforeRow={ props.beforeRow }
          name={ props.name ?? '' }
        />
        { repeatable && (
          <div className="tf-repeater-actions">
            <Button 
              type="action" 
              onPress={ () => dispatch({ type: 'add' }) } 
              isDisabled={ maxLength <= items.length }
            >
              Add item
            </Button>
            <ModalTrigger 
              title="Confirmation"
              label="Remove all"
              isDisabled={ items.length <= 0 }
              onValidate={ () => dispatch({ type: 'clear' })}
            >
              Are you sure you want to clear all item(s)?
            </ModalTrigger>
          </div>
        )}
      </div>
    </div>
  )
}

export default Repeater
