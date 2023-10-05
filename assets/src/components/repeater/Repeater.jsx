import { 
  useEffect, 
  useReducer,
  useState,
  useContext,
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
import Control from '../../Control'

const Repeater = props => {

  const fields = props.fields ?? []
  
  const layout = props.layout ?? 'table'
  const Layout = Layouts[ layout ]

  const repeatable = props.repeatable ?? true
  const maxLength = props.maxlength ?? Infinity

  const { ControlContext } = tangibleFields 
  const context = useContext(ControlContext)

  const rowFields = fields.map(field => {

    const rowField = Object.assign({}, field)
    
    if( layout === 'table' ) {
      delete rowField.label
      delete rowField.description
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

  const getControl = (control, item, i) => (
    <Control
      key={ item.key + i} 
      value={ item[control.name] ?? '' }
      onChange={ value => dispatch({ 
        type     : 'update',
        item     : i,
        control  : control.name,
        value    : value,
        callback : () => triggerRowCallbackEvents(item.key, control.name)
      }) }
      controlType={ 'subfield' }
      visibility={{
        action: control.condition?.action ?? 'show',
        condition: control.condition?.condition ?? false
      }}
      /**
       * Used by visbility and dependent values to detect changes and access data 
       */
      data={{
        /**
         * The field value can either be from a subvalue or from another field value
         */
        getValue: name => (
          hasField(name)
            ? (values.current[i][name] ?? '') 
            : (context[name] ?? '')
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
              rowKey === item.key && control.name 
                ? callback(fieldName, item.key) 
                : null
            } 
          ]
        )
      }}
      { ...control }
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
      {props.label && <Title level={2} className='tf-repeater-title'>{ props.label }</Title>}
      <Layout
        items={ items }
        fields={ fields }
        dispatch={ dispatch }
        rowFields={ rowFields }
        getControl={ getControl }
        maxLength = { repeatable ? maxLength : undefined }
        title={ props.sectionTitle ?? false }
        useSwitch={ props.useSwitch }
        useBulk={ props.useBulk }
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
  )
}

export default Repeater
