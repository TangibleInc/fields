import {
  useRef,
  useState,
  useEffect,
  lazy,
  Suspense,
  forwardRef,
} from 'react'

import { useTextField } from 'react-aria'
import { Field, Textarea as TuiTextarea } from '@tangible/ui'
import type { SizeStandard } from '@tangible/ui'
import { Description, Label } from '../../base'

const DynamicEditor = lazy(() => import('../../dynamic/editor/DynamicEditor'))

export interface FieldsTextareaProps {
  dynamic?: unknown
  value?: string
  onChange?: (value: string) => void
  name?: string
  label?: string
  labelVisuallyHidden?: boolean
  description?: string
  descriptionVisuallyHidden?: boolean
  placeholder?: string
  readOnly?: boolean
  isDisabled?: boolean
  isRequired?: boolean
  isInvalid?: boolean
  error?: boolean
  className?: string
  maxlength?: number
  minlength?: number
  rows?: number
  required?: boolean
  identifier?: string
  size?: SizeStandard
}

/**
 * Dynamic path sub-component — rendered only when the `dynamic` prop is set.
 * Isolated here so `useTextField` (react-aria) is only called in this path.
 */
const DynamicTextarea = (props: FieldsTextareaProps) => {
  const [value, setValue] = useState(props.value ?? '')
  const ref = useRef<HTMLTextAreaElement | null>(null)

  const {
    labelProps,
    inputProps,
    descriptionProps,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useTextField({ ...props, inputElementType: 'textarea' } as any, ref as any)

  useEffect(() => {
    if (props.onChange) props.onChange(value)
  }, [value])

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
 * Textarea with two routing paths:
 * 1. dynamic → ProseMirror-based DynamicEditor (multi-line)
 * 2. plain → TUI Textarea + Field compound
 */
const TextArea = forwardRef<HTMLTextAreaElement, FieldsTextareaProps>((props, ref) => {
  const hasDynamic = Boolean(props.dynamic)

  if (hasDynamic) {
    return <DynamicTextarea {...props} />
  }

  return (
    <div className='tf-text-area'>
      <Field
        className={props.className}
        required={Boolean(props.isRequired)}
        disabled={Boolean(props.isDisabled || props.readOnly)}
        error={Boolean(props.isInvalid || props.error)}
      >
        {props.label &&
          <Field.Label hidden={Boolean(props.labelVisuallyHidden)}>
            {props.label}
          </Field.Label>}
        <Field.Control>
          <TuiTextarea
            ref={ref}
            size={props.size}
            placeholder={props.placeholder}
            readOnly={props.readOnly}
            rows={props.rows}
            maxLength={props.maxlength}
            minLength={props.minlength}
            required={props.required}
            name={props.name}
            value={props.value ?? ''}
            onChange={event => {
              if (props.onChange) props.onChange(event.target.value)
            }}
            data-identifier={props.identifier ?? ''}
          />
        </Field.Control>
        {props.description && (
          <Field.HelperText className={props.descriptionVisuallyHidden ? 'tui-visually-hidden' : undefined}>
            {props.description}
          </Field.HelperText>
        )}
      </Field>
    </div>
  )
})

export default TextArea
