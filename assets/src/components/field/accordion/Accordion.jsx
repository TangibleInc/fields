import { useState } from 'react'
import FieldGroup from '../field-group/FieldGroup'
import { ExpandablePanel } from '../../base'

const Accordion = props => {

    const [showItem, setShowItem] = useState(true)
    
    const title = props.title ?? ''

    return (
        <div class='tf-repeater-block-items' >
          <div class='tf-repeater-block-item'>
          <ExpandablePanel 
            title={ title } 
            showItem={ showItem } 
            toggleShow={ () => setShowItem(!showItem) } 
            accordion_switch={ props.accordion_switch } 
            accordion_checkbox={ props.accordion_checkbox } 
          >
            {
              showItem ?
                <div class='tf-repeater-block-item-field'>
                  <FieldGroup 
                    { ...props }
                  />
                </div> 
              : ''
            }
          </ExpandablePanel>
          </div>
        </div>
    )
}

export default Accordion
