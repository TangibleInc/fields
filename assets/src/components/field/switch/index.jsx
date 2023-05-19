import {
  useState,
  useEffect
} from 'react'

import Switch from './Switch'

export default props => {
  
  const valueOn = props.valueOn ?? 'on' 
  const valueOff = props.valueOff ?? 'off'

  const [value, setValue] = useState(props.value ?? valueOff)
  
  useEffect(() => props.onChange && props.onChange(value), [value])
  useEffect(() => {
    if( ! [valueOn, valueOff].includes(props.value) ) return;
    if( props.value !== value ) setValue(props.value)
  }, [props.value])

  return(
    <>
      <input type="hidden" name={ props.name ?? ''} value={ value } />
      <Switch
        label={ props.label ?? '' }
        description={ props.description ?? '' }
        value={ value === valueOn } 
        onChange={ switchValue => setValue(switchValue ? valueOn : valueOff )} 
      />
    </>
  )
}
