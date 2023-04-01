import { 
  useState,
  useEffect 
} from 'react'

import { Switch } from '../../field'
import { FieldGroup } from '..'
import { ExpandablePanel } from '../../base'
import { initJSON } from '../../../utils'

const Accordion = props => {

  const [value, setValue] = useState(initJSON(props.value))

  useEffect(() => props.onChange && props.onChange(value), [value])
  
  const isEnabled = isEnabled => {
    setValue({
      ...value, 
      enabled: isEnabled === true || isEnabled === 'on' 
        ? 'on' : 'off'
    })
  }
  
  const headerLeft = props.useSwitch
    ? <div onClick={ e => e.stopPropagation() }>
        <Switch value={ value.enabled ?? 'off' } onChange={ isEnabled }  />
      </div>  
    : null
  
  return(
    <div class='tf-accordion'>
      <ExpandablePanel 
        title={ props.title ?? false }  
        headerLeft={ headerLeft }
        behavior={ 'hide' }
      >
        <FieldGroup 
          { ...props } 
          fields={[
            ...props.fields,
            {
              type: 'hidden',
              name: 'enabled' 
            }
          ]} 
          value={ value }
          onChange={ setValue }
        />  
      </ExpandablePanel>
    </div>
  )
}

export default Accordion
