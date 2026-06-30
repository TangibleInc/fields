import {
  forwardRef,
  useRef
} from 'react'

import { Checkbox as TuiCheckbox, Field } from '@tangible/ui'

export interface FieldsCheckboxProps {
  value?: boolean | '1' | '0'
  onChange?: (value: boolean) => void
  label?: string
  labelVisuallyHidden?: boolean
  description?: string
  descriptionVisuallyHidden?: boolean
  isDisabled?: boolean
  isRequired?: boolean
  name?: string
  className?: string
}

const Checkbox = forwardRef<HTMLInputElement, FieldsCheckboxProps>((props, ref) => {

  const {
    value,
    onChange,
    label,
    labelVisuallyHidden,
    description,
    descriptionVisuallyHidden,
    isDisabled,
    isRequired,
    name,
    className,
  } = props

  const warnedRef = useRef(false)
  if (!warnedRef.current && !label) {
    warnedRef.current = true
    console.warn('Checkbox: Missing label. Provide a label prop for accessibility.')
  }

  /**
   * Derive boolean checked state directly from the value prop.
   * When value is provided, TUI Checkbox is fully controlled — no local state needed.
   * External changes (e.g. repeater bulk-select) are reflected automatically.
   */
  const boolValue = value === '1' || value === true
  const controlledProps = value !== undefined
    ? { checked: boolValue }
    : { defaultChecked: false }

  const labelContent = label
    ? labelVisuallyHidden
      ? <span className="tui-visually-hidden">{label}</span>
      : label
    : undefined

  return (
    <div className="tf-checkbox">
      <Field
        className={className}
        required={Boolean(isRequired)}
        disabled={Boolean(isDisabled)}
      >
        <TuiCheckbox
          ref={ref}
          label={labelContent}
          {...controlledProps}
          disabled={Boolean(isDisabled)}
          onCheckedChange={nextChecked => {
            if (onChange) onChange(nextChecked)
          }}
        />
        <input type="hidden" name={name ?? ''} value={boolValue ? '1' : '0'} />
        {description && (
          <Field.HelperText className={descriptionVisuallyHidden ? 'tui-visually-hidden' : undefined}>
            {description}
          </Field.HelperText>
        )}
      </Field>
    </div>
  )
})

export default Checkbox
