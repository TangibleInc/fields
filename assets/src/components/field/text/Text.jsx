import { useRef } from 'react'
import { useTextField } from 'react-aria'

/**
 * @see https://react-spectrum.adobe.com/react-aria/useTextField.html
 */

const TextField = props => {

  const { label } = props
  const ref = useRef()

  const { 
    labelProps, 
    inputProps, 
    descriptionProps, 
    errorMessageProps 
  } = useTextField(props, ref)

  return (
    <div class='tf-text'>
      <label  {...labelProps }>
        { label }
      </label>
      <input { ...inputProps } ref={ ref } />
      { props.description && (
        <div { ...descriptionProps }>
          { props.description }
        </div>
      ) }
      { props.errorMessage &&
        <div { ...errorMessageProps }>
          { props.errorMessage }
        </div> }
    </div>
  )
}

export default TextField
