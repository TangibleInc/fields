import { useRef } from 'react'
import { useTextField } from 'react-aria'

import { Description, Label } from '../../base'

/**
 * @see https://react-spectrum.adobe.com/react-aria/useTextField.html
 */

const TextArea = (props) => {
  const ref = useRef()

  const { labelProps, inputProps, descriptionProps } = useTextField(
    { ...props, inputElementType: 'textarea' },
    ref
  )

  return (
    <div className='tf-text-area'>
      {props.label && 
        <Label labelProps={ labelProps } parent={ props }>
          { props.label }
        </Label> }
      <textarea
        {...inputProps}
        maxLength={props.maxlength}
        minLength={props.minlength}
        required={props.required}
        rows={props.rows}
        ref={ref}
        data-identifier={props.identifier ?? ''}
      ></textarea>
      {props.description && (
        <Description descriptionProps={ descriptionProps } parent={ props }>
          { props.description }
        </Description>
      )}
    </div>
  )
}

export default TextArea
