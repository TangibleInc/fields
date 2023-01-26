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
    <div class='tf-text'>
      { props.label &&
        <Label { ...labelProps }>
				  <label>
						{ props.label }
						<input { ...inputProps } ref={ ref } />
					</label>
        </Label> }
      { props.description &&
        <Description { ...descriptionProps }>
          { props.description }
        </Description> }
    </div>
  )
}

export default TextField
