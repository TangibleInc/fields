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
        <Switch 
          value={ value.enabled ?? 'off' } 
          onChange={ isEnabled }
          label={ 'Toggle accordion' }
          labelVisuallyHidden={ true }
        />
      </div>  
    : null
  
  return(
    <div className='tf-accordion'>
      <input type='hidden' name={ props.name ?? '' } value={ JSON.stringify(value) } />
      <ExpandablePanel 
        title={ props.title ?? false }  
        headerLeft={ headerLeft }
        behavior={ 'hide' }
      >
        <FieldGroup 
          { ...props }
          name={ null } 
          fields={ props.fields } 
          value={ value }
          onChange={ setValue }
        />  
      </ExpandablePanel>
    </div>
  )
}

export default Accordion
