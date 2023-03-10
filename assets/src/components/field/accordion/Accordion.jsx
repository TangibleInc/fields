import { useState, useEffect, useReducer } from 'react'
import { Button } from '../../base'
import Control from '../../../Control'

const Accordion = props => {

    console.log(props)
    const [showItem, setShowItem] = useState(true)
    const toggleShow = () => setShowItem( !showItem )

    const fields = props.fields ?? []

    console.log(Array.prototype.values(fields))

    const rowFields = fields.maps( (field, label) => {

        const rowField = Object.assign({}, field)
        
        const layout = field.layout ?? ''

        if( layout === 'table' ) {
            delete rowField.label
            delete rowField.description
        }
        
        return rowField
    })

    console.log(rowFields)

    const [items, dispatch] = useReducer(
        repeaterDispatcher(emptyItem, maxLength), 
        props.value ?? '',
        initDispatcher
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

    return (
        <div class='tf-repeater-block-items'>
            <Button type="action" onPress={ () => toggleShow() }>
              { showItem ? 'Close' : 'Edit' }
            </Button>
            test
        </div>
    )
}

export default Accordion
