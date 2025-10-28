import { 
  useState, 
  useEffect 
} from 'react'

import { getOptions } from '../../../utils'
import { RadioGroup } from './RadioGroup'

import Radio from './Radio'

export default props => {
  
  const [value, setValue] = useState(props.value ?? '')
  const options = getOptions(props.choices ?? {})

  useEffect(() => props.onChange && props.onChange(value), [value])

  return(
    <RadioGroup { ...props } onChange={ setValue }>
      { options.map(option => (
        <Radio key={ option.value ?? '' } { ...option }>
          { option.label ?? '' }
        </Radio>
      )) }
    </RadioGroup>
  )
}
