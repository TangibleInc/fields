import { useRef } from 'react'
import { useTextField } from 'react-aria'

import { 
  Description,
  Label 
} from '../../base'

/**
 * @see https://react-spectrum.adobe.com/react-aria/useTextField.html
 */

const TextField = props => {

  const ref = useRef()

  const { 
    labelProps, 
    inputProps, 
    descriptionProps, 
  } = useTextField(props, ref)

  return(
    <div className='tf-text'>
      { props.label &&
        <Label { ...labelProps }>
          { props.label }
        </Label> }
      <input { ...inputProps } ref={ ref } />
      { props.description &&
        <Description { ...descriptionProps }>
          { props.description }
        </Description> }
    </div>
  )
}

export default TextField
