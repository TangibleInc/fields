import { 
  useState, 
  useEffect 
} from 'react'

import { RadioGroup } from './RadioGroup'
import Radio from './Radio'

export default props => {
  
  const [value, setValue] = useState(props.value ?? '')
  const options = props.options ?? []
  
  if( props.onChange ) {
    useEffect(props.onChange, [value])
  }

  return(
    <RadioGroup { ...props } onChange={ setValue }>
      { options.map(option => (
        <Radio { ...option }>{ option.label ?? '' }</Radio>
      )) }
    </RadioGroup>
  )
}
