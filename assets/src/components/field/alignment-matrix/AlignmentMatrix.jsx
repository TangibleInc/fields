import Radio from '../radio/Radio'
import { RadioGroup } from '../radio/RadioGroup'
import { VisuallyHidden } from 'react-aria'
import { useState, useEffect } from 'react'

const AlignmentMatrix = (props) => {
  const [value, setValue] = useState(props.value ?? '')

  const options = [
    'top left',
    'top center',
    'top right',
    'center left',
    'center center',
    'center right',
    'bottom left',
    'bottom center',
    'bottom right',
  ]

  useEffect(() => props.onChange && props.onChange(value), [value])

  return (
    <div className='tf-alignment-matrix'>
      <RadioGroup {...props} onChange={setValue}>
        <div className='tf-alignment-matrix-container'>
          {options.map(option => (
            <Radio 
              key={ option } 
              id={ option } 
              value={ option }
            >
              <VisuallyHidden>
                { option }
              </VisuallyHidden>  
            </Radio>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}
export default AlignmentMatrix
