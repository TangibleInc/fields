import { useState } from 'react'
import FieldGroup from '../field-group/FieldGroup'

const Accordion = props => {

    const [showItem, setShowItem] = useState(true)
    const toggleShow = () => setShowItem( !showItem )

    return (
        <div class='tf-accordion-items' >
            <div class='tf-accordion-header' onClick={ () => toggleShow() } >
              <div class='tf-accordion-group-buttons' >
                <span class={showItem ? 'tf-accordion-arrow tf-accordion-arrow-up' : 'tf-accordion-arrow tf-accordion-arrow-down'} />
              </div>
            </div>
            {
              showItem ?
                <div class="tf-accordion-item">
                  <FieldGroup 
                    { ...props }
                  />
                </div> 
              : ''
            }
        </div>
    )
}

export default Accordion
