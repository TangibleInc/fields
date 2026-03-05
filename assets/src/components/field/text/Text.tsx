import {
  useRef,
  useEffect,
  useState,
  lazy,
  Suspense
} from 'react'

import { useTextField } from 'react-aria'
import { Field, TextInput as TuiTextInput } from '@tangible/ui'
import type { SizeStandard, TextInputType } from '@tangible/ui'

import Description from '../../base/field/Description'
import Label from '../../base/field/Label'
import { useInputMask, matchesMask } from '../../../utils/use-input-mask'

const DynamicEditor = lazy(() => import('../../dynamic/editor/DynamicEditor'))

/**
 * Text field with three routing paths:
 * 1. dynamic → ProseMirror-based DynamicEditor (lazy-loaded)
 * 2. inputMask (no dynamic) → TUI TextInput + useInputMask hook
 * 3. plain → TUI TextInput with optional prefix/suffix
 *
 * @see https://react-spectrum.adobe.com/react-aria/useTextField.html
 */

export interface FieldsTextProps {
  dynamic?: unknown
  inputMask?: string
  prefix?: string
  suffix?: string
  value?: string
  onChange?: (value: string) => void
  name?: string
  placeholder?: string
  readOnly?: boolean
  isDisabled?: boolean
  isRequired?: boolean
  isInvalid?: boolean
  error?: boolean
  label?: string
  labelVisuallyHidden?: boolean
  description?: string
  descriptionVisuallyHidden?: boolean
  className?: string
  inputClassName?: string
  size?: SizeStandard
  type?: TextInputType
}

const TextField = (props: FieldsTextProps) => {
  const {
    dynamic,
    inputMask,
    prefix,
    suffix,
  } = props

  const hasDynamic = Boolean(dynamic)

  const [value, setValue] = useState(props.value ?? '')
  const ref = useRef<HTMLInputElement | null>(null)
  const inputMaskRef = useRef<HTMLInputElement | null>(null)

  const {
    labelProps,
    inputProps,
    descriptionProps,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useTextField(props as any, ref as any)

  useInputMask(inputMaskRef, !hasDynamic ? inputMask : null)

  useEffect(() => {
    if (props.onChange) props.onChange(value)
  }, [value])

  // Validate initial mask value
  const getInitialMaskValue = () => {
    if (!inputMask || !value) return value
    const stripped = stripAffixes(value, prefix, suffix)
    return matchesMask(stripped, inputMask) ? value : ''
  }

  /**
   * Dynamic path — ProseMirror editor
   */
  if (hasDynamic) {
    return (
      <div className="tf-text tf-text-dynamic">
        {props.label &&
          <Label labelProps={labelProps} parent={props}>
            {props.label}
          </Label>}
        <Suspense fallback={null}>
          <DynamicEditor
            value={value}
            onChange={setValue}
            dynamic={dynamic}
            name={props.name}
            placeholder={props.placeholder}
            readOnly={props.readOnly}
            prefix={prefix}
            suffix={suffix}
            singleLine={true}
            inputProps={inputProps}
          />
        </Suspense>
        {props.description &&
          <Description descriptionProps={descriptionProps} parent={props}>
            {props.description}
          </Description>}
      </div>
    )
  }

  /**
   * Native path — TUI TextInput (with optional input mask, prefix, suffix)
   */
  return (
    <div className="tf-text tf-text-tui">
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
          <TuiTextInput
            ref={node => {
              ref.current = node
              // For input masking, grab the actual <input> element
              if (inputMask && node) {
                inputMaskRef.current = node.querySelector?.('input') ?? node
              }
            }}
            inputClassName={`tui-input-reset ${props.inputClassName ?? ''}`.trim()}
            size={props.size}
            type={props.type ?? 'text'}
            placeholder={props.placeholder}
            readOnly={props.readOnly}
            value={inputMask ? getInitialMaskValue() : value}
            onChange={event => setValue(event.target.value)}
            name={props.name ?? ''}
            prefix={prefix}
            suffix={suffix}
          />
        </Field.Control>
        {props.description &&
          <Field.HelperText className={props.descriptionVisuallyHidden ? 'tui-visually-hidden' : undefined}>
            {props.description}
          </Field.HelperText>}
      </Field>
    </div>
  )
}

/**
 * Strip prefix/suffix from a stored value for mask validation.
 */
function stripAffixes(value: string, prefix?: string, suffix?: string): string {
  let result = value
  if (prefix && result.startsWith(prefix)) {
    result = result.slice(prefix.length)
  }
  if (suffix && result.endsWith(suffix)) {
    result = result.slice(0, result.length - suffix.length)
  }
  return result
}

export default TextField
