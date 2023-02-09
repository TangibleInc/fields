import { 
  useEffect, 
  useReducer 
} from 'react'

import { 
  repeaterDispatcher, 
  initDispatcher 
} from './dispatcher.js'

import { Button } from '../base'
import { applyDynamicValues } from '../../dynamic' 

import Layouts from './layout' 
import Control from '../../Control'

const Repeater = props => {

  const fields = props.fields ?? []

  const layout = props.layout ?? 'table'
  const Layout = Layouts[ layout ]

  const repeatable = props.repeatable ?? true
  const maxLength = props.maxlength ?? Infinity

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
    props.value ?? [],
    initDispatcher
  )

  const getRow = item => (
    applyDynamicValues(
      props.element ?? false,
      rowFields,
      item
    )
  )

  const getControl = (control, item, i) => (
    <Control 
      value={ item[control.name] ?? '' }
      onChange={ value => dispatch({ 
        type    : 'update',
        item    : i,
        control : control.name,
        value   : value
      }) }
      { ...control }
    />
  )

  useEffect(() => props.onChange(items), [items])

  return(
    <div class={ `tf-repeater tf-repeater-${layout}`}>
      <input type='hidden' name={ props.name ?? '' } value={ JSON.stringify(items) } />
      <Layout
        items={ items }
        fields={ fields }
        dispatch={ dispatch }
        getRow={ getRow }
        getControl={ getControl }
        maxLength = { repeatable ? maxLength : undefined }
      />
      { repeatable && (
        <div class="tf-repeater-actions">
          <Button 
            type="action" 
            onPress={ () => dispatch({ type: 'add' }) } 
            isDisabled={ maxLength <= items.length }
          >
            Add item
          </Button>
          <Button 
            type="action" 
            onPress={ () => dispatch({ type: 'clear' }) }
            isDisabled={ items.length <= 0 }
          >
            Clear item
          </Button>
        </div>
      )}
    </div>
  )
}

export default Repeater
