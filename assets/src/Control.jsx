import { 
  useState, 
  useEffect 
} from 'react'

import controls from './controls-list.js'
import { dispatchEvent } from './events'

const Control = props => {

  const [value, setValue] = useState(props.value ?? '')

  useEffect(() => props.onChange && props.onChange(value), [value])
  
  const type = props.type ?? 'text'
  const ControlComponent = controls[ type ] ?? false
  
  if( ! ControlComponent ) return <></>;

  const childProps = Object.assign({}, props)
  
  delete childProps.value
  delete childProps.onChange
  
  const onChange = newValue => {

    dispatchEvent('valueChange', {
      name      : props.name ?? false, 
      props     : props,
      value     : newValue,
    })

    setValue(newValue)
  }

  return(
    <ControlComponent value={ value } onChange={ onChange } { ...childProps }  />
  )
}

export default Control
