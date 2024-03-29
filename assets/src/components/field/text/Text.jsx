import { 
  useRef,
  useEffect,
  useState
} from 'react'

import { useTextField } from 'react-aria'
import { TextInput } from '../../dynamic/'

import { 
  Description,
  Label
} from '../../base'

/**
 * @see https://react-spectrum.adobe.com/react-aria/useTextField.html
 */

const TextField = props => {

  const [value, setValue] = useState(props.value ?? '')
  const ref = useRef()

  const { 
    labelProps,
    inputProps, 
    descriptionProps, 
  } = useTextField(props, ref)
  
  useEffect(() => {
    if( props.onChange ) props.onChange(value)
  }, [value])
  
  return(
    <div className='tf-text'>
      { props.label &&
        <Label labelProps={ labelProps } parent={ props }>
          { props.label }
        </Label> }
      <TextInput
        { ...props }
        inputProps={ inputProps }
        onChange={ setValue }
        ref={ ref }
        dynamic={ props.dynamic ?? false } 
      />
      { props.description &&
        <Description descriptionProps={ descriptionProps } parent={ props }>
          { props.description }
        </Description> }
    </div>
  )
}

export default TextField
