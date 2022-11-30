import { 
  useState, 
  useEffect 
} from 'react'

import controls from './controls-list.js'

const Control = props => {
  
  const [value, setValue] = useState(props.value ?? '')

  if( props.onChange ) {
    useEffect(() => props.onChange(value), [value])
  }
  
  const type = props.type ?? 'text'
  const ControlComponent = controls[ type ] ?? false

  if( ! ControlComponent ) return <></>;

  const childProps = Object.assign({}, props)
  
  delete childProps.value
  delete childProps.onChange

  return(
    <ControlComponent onChange={ setValue } value={ value } { ...childProps } />
  )
}

export default Control
