import { useRef } from 'react';
import { useTextField } from 'react-aria';

import { Description, Label } from '../../base';

/**
 * @see https://react-spectrum.adobe.com/react-aria/useTextField.html
 */

const TextArea = props => {
    const ref = useRef()
    
    const {
      labelProps,
      inputProps,
      descriptionProps
    } = useTextField({ ...props, inputElementType: 'textarea' }, ref)

    return (
      <div className="tf-text-area">
        {props.label && <Label { ...labelProps }>{ props.label }</Label>}
        <textarea { ...inputProps } ref={ ref }></textarea>
        {props.description && <Description { ...descriptionProps }>{ props.description }</Description>}
      </div>
    )
}

export default TextArea;
