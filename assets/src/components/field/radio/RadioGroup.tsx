import { forwardRef } from 'react'

import { RadioGroup as TuiRadioGroup, Field } from '@tangible/ui'

export interface FieldsRadioGroupProps {
  value?: string
  onChange?: (value: string) => void
  label?: string
  description?: string
  isDisabled?: boolean
  isRequired?: boolean
  name?: string
  className?: string
  children?: React.ReactNode
}

/**
 * <RadioGroup label="Radio label">
 *   <Radio value="2">Value 1</Radio>
 *   <Radio value="1">Value 2</Radio>
 * </RadioGroup>
 */

const RadioGroup = forwardRef<HTMLDivElement, FieldsRadioGroupProps>((props, ref) => {

  const {
    value,
    onChange,
    label,
    description,
    isDisabled,
    isRequired,
    name,
    className,
    children,
  } = props

  const controlledProps = value !== undefined
    ? { value }
    : { defaultValue: '' }

  return (
    <div ref={ref} className="tf-radio-group">
      <Field
        className={className}
        required={Boolean(isRequired)}
        disabled={Boolean(isDisabled)}
      >
        {label && <Field.Label>{label}</Field.Label>}
        <TuiRadioGroup
          {...controlledProps}
          disabled={Boolean(isDisabled)}
          onValueChange={val => {
            if (onChange) onChange(String(val))
          }}
        >
          {children}
        </TuiRadioGroup>
        <input type="hidden" name={name ?? ''} value={value ?? ''} />
        {description && (
          <Field.HelperText>{description}</Field.HelperText>
        )}
      </Field>
    </div>
  )
})

export { RadioGroup }
