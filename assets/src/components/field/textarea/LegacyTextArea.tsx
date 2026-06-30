import {
  useRef,
  useState,
  useEffect,
  lazy,
  Suspense,
} from 'react'

import { useTextField } from 'react-aria'
import { Description, Label } from '../../base'

const DynamicEditor = lazy(() => import('../../dynamic/editor/DynamicEditor'))

/**
 * Textarea with two routing paths:
 * 1. dynamic → ProseMirror-based DynamicEditor (multi-line)
 * 2. plain → native <textarea>
 *
 * @see https://react-spectrum.adobe.com/react-aria/useTextField.html
 */

const TextArea = (props) => {
  const ref = useRef()
  const hasDynamic = Boolean(props.dynamic)

  const [value, setValue] = useState(props.value ?? '')

  const { labelProps, inputProps, descriptionProps } = useTextField(
    { ...props, inputElementType: 'textarea' },
    ref
  )

  useEffect(() => {
    if (props.onChange) props.onChange(value)
  }, [value])

  /**
   * Dynamic path — ProseMirror editor (multi-line)
   */
  if (hasDynamic) {
    return (
      <div className="tf-text-area tf-text-area-dynamic">
        {props.label &&
          <Label labelProps={labelProps} parent={props}>
            {props.label}
          </Label>}
        <Suspense fallback={null}>
          <DynamicEditor
            value={value}
            onChange={setValue}
            dynamic={props.dynamic}
            name={props.name}
            placeholder={props.placeholder}
            readOnly={props.readOnly}
            singleLine={false}
            inputProps={inputProps}
          />
        </Suspense>
        {props.description && (
          <Description descriptionProps={descriptionProps} parent={props}>
            {props.description}
          </Description>
        )}
      </div>
    )
  }

  /**
   * Native path — standard <textarea>
   */
  return (
    <div className='tf-text-area'>
      {props.label &&
        <Label labelProps={labelProps} parent={props}>
          {props.label}
        </Label>}
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
        <Description descriptionProps={descriptionProps} parent={props}>
          {props.description}
        </Description>
      )}
    </div>
  )
}

export default TextArea
