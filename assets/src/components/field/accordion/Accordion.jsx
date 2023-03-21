import { useState } from 'react'
import FieldGroup from '../field-group/FieldGroup'
import { ExpandablePanel } from '../../base'

const Accordion = props => {

    const [showItem, setShowItem] = useState(true)
    
    const title = 'test'

    return (
        <div class='tf-accordion-items' >
          <ExpandablePanel 
            title={ title } 
            showItem={ showItem } 
            toggleShow={ () => setShowItem(!showItem) } 
            accordion_switch={ props.accordion_switch } 
            accordion_checkbox={ props.accordion_checkbox } 
          >
            {
              showItem ?
                <div class="tf-accordion-item">
                  <FieldGroup 
                    { ...props }
                  />
                </div> 
              : ''
            }
          </ExpandablePanel>
        </div>
    )
}

export default Accordion
