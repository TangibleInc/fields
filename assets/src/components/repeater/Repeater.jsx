import { 
  useEffect, 
  useReducer,
  useState,
  useContext
} from 'react'

import { 
  repeaterDispatcher, 
  initDispatcher 
} from './dispatcher.js'

import { Button, Title, ModalTrigger } from '../base'
import { applyDependentValues } from '../../dependent' 

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

  const [visibilityCallbacks, setVisibilityCallbacks] = useState([])
  const [items, dispatch] = useReducer(
    repeaterDispatcher(emptyItem, maxLength), 
    props.value ?? '',
    initDispatcher
  )

  const getRow = item => (
    applyDependentValues(
      props.element ?? false,
      rowFields,
      item
    )
  )
  
  const hasField = name => (
    rowFields.map(
      field => field.name ?? false
    ).includes(name)
  )

  /**
   * Call all the visibility callback registered for a given repeater row
   */
  const evaluateRowVisibility = (rowKey, fieldName) => {
    visibilityCallbacks.forEach(callback => callback(rowKey, fieldName))
  }

  const getControl = (control, item, i) => (
    <Control 
      value={ item[control.name] ?? '' }
      onChange={ value => dispatch({ 
        type     : 'update',
        item     : i,
        control  : control.name,
        value    : value,
        callback : () => evaluateRowVisibility(item.key, control.name)  
      }) }
      controlType={ 'subfield' }
      visibility={{
        action: control.condition?.action ?? 'show',
        condition: control.condition?.condition ?? false,
        /**
         * The field value can either be from a subvalue or from another field value
         */
        getValue: name => (
          hasField(name)
            ? (item[name] ?? '') 
            : (context[name] ?? '')
        ),
        /**
         * Needed to trigger a re-evaluatation of the visibility conditions according when a subfield value change
         * TODO: When removing a row remove associated callbacks
         */
        watcher: evaluationCallback => {
          setVisibilityCallbacks(
            prevValue => [ 
              ...prevValue,
              (rowKey, fieldName) => {
                rowKey === item.key && control.name 
                  ? evaluationCallback(fieldName) 
                  : null
              } 
            ]
          )       
        }
      }}
      { ...control }
    />
  )

  useEffect(() => props.onChange(items), [items])

  return(
    <div className={ `tf-repeater tf-repeater-${layout}`}>
      <input type='hidden' name={ props.name ?? '' } value={ JSON.stringify(items) } />
      {props.label && <Title level={2} className='tf-repeater-title'>{ props.label }</Title>}
      <Layout
        items={ items }
        fields={ fields }
        dispatch={ dispatch }
        getRow={ getRow }
        getControl={ getControl }
        maxLength = { repeatable ? maxLength : undefined }
        title={ props.sectionTitle ?? '' }
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
            label="Clear item"
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
