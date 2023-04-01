import { FieldGroup } from '..'
import { ExpandablePanel } from '../../base'

import { 
  Checkbox, 
  Switch 
} from '../../field'

const Accordion = props => {

  const headerLeft = 
    <>
      { true && <Checkbox value={ props.accordion_checkbox ?? true } /> }
      { true && <Switch value={ props.accordion_switch ?? true } /> }
    </>
    
  return (
    <div class='tf-accordions'>
      <ExpandablePanel 
        title={ props.title ?? false }  
        headerLeft={ headerLeft }
      >
        <FieldGroup { ...props } />  
      </ExpandablePanel>
    </div>
  )
}

export default Accordion
