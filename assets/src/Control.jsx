import { 
  useState, 
  useEffect 
} from 'react'

import controls from './controls-list.js'

const Control = props => {

  const [value, setValue] = useState(props.value ?? '')

  useEffect(() => props.onChange && props.onChange(value), [value])
  
  const type = props.type ?? 'text'
  const ControlComponent = controls[ type ] ?? false

  if( ! ControlComponent ) return <></>;

  const childProps = Object.assign({}, props)
  
  delete childProps.value
  delete childProps.onChange

  return(
    <ControlComponent value={ value } onChange={ setValue } { ...childProps }  />
  )
}

export default Control
