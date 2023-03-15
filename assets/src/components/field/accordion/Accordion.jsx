import { useState, useEffect, useReducer } from 'react'
import { Button } from '../../base'
import Control from '../../../Control'
import { applyDynamicValues } from '../../../dynamic'
import { initDispatcher, repeaterDispatcher } from '../../repeater/dispatcher'

const Accordion = props => {

    const [showItem, setShowItem] = useState(true)
    const toggleShow = () => setShowItem( !showItem )

    const fields = props.fields ?? []
    const maxLength = Infinity

    const emptyItem = {}
    fields.forEach(field => emptyItem[ field.name ] = '')

    const [items, dispatch] = useReducer(
      repeaterDispatcher(emptyItem, maxLength), 
      props.value ?? '',
      initDispatcher
    ) 

    const rowFields = fields.map(field => {

      const rowField = Object.assign({}, field)
      
      if( field.layout && field.layout === 'table' ) {
        delete rowField.label
        delete rowField.description
      }

      delete rowField.value
      delete rowField.onChange
      
      return rowField
    })

    const getRow = item => (
      applyDynamicValues(
        props.element ?? false,
        rowFields,
        item
      )
    )

    useEffect(() => {
      props.onChange(items)
    }, [items])

    return (
        <div class='tf-accordion-items' >
            <div class='tf-accordion-header' onClick={ () => toggleShow() } >
              <div class='tf-accordion-group-buttons' >
                <span class={showItem ? 'tf-accordion-arrow tf-accordion-arrow-up' : 'tf-accordion-arrow tf-accordion-arrow-down'} />
              </div>
            </div>
            {
              showItem ?
                items.map((item, i) => {
                  return getRow(item).map(
                    control => {
                      return <div class="tf-accordion-item">
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
                      </div>
                    }
                  )
                })
              : ''
            }
        </div>
    )
}

export default Accordion
