import { useState } from 'react'
import { Field, MultiSelect } from '@tangible/ui'
import { getOptions } from '../../../utils'
import { renderSelectOptions } from './renderOptions'

/** Parse the incoming value (comma-string or array) into a keys array. */
const parseValues = (value: any): (string | number)[] => {
  if (Array.isArray(value)) return value
  return String(value ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

/**
 * Multi-select on TUI's MultiSelect. Value contract preserved:
 *  - hidden input: comma-joined keys ("a,b,c")
 *  - onChange:     array of keys  (matches the react-stately implementation,
 *                  which returned an array so it serializes cleanly)
 */
const Multiple = (props: any) => {
  const options = getOptions(props.choices ?? {})
  const [values, setValues] = useState<(string | number)[]>(() => parseValues(props.value))
  const disabled = Boolean(props.readOnly)

  const handleChange = (next: (string | number)[]) => {
    setValues(next)
    props.onChange?.([...next])
  }

  return (
    <div className="tf-select-field tf-select-multiple">
      <input type="hidden" name={props.name ?? ''} value={values.join(',')} />
      <Field
        className={props.className}
        disabled={disabled}
        required={Boolean(props.isRequired)}
        error={Boolean(props.isInvalid)}
      >
        {props.label && (
          <Field.Label hidden={Boolean(props.labelVisuallyHidden)}>{props.label}</Field.Label>
        )}
        <Field.Control>
          <MultiSelect
            value={values}
            onValueChange={handleChange}
            placeholder={props.placeholder ?? 'Select options'}
            display="chips"
            disabled={disabled}
          >
            <MultiSelect.Trigger />
            <MultiSelect.Content>
              {renderSelectOptions(options, {
                disabledKeys: props.disabledKeys,
                parts: {
                  Option: MultiSelect.Option,
                  Group: MultiSelect.Group,
                  Label: MultiSelect.Label,
                },
              })}
            </MultiSelect.Content>
          </MultiSelect>
        </Field.Control>
        {props.description && (
          <Field.HelperText
            className={props.descriptionVisuallyHidden ? 'tui-visually-hidden' : undefined}
          >
            {props.description}
          </Field.HelperText>
        )}
      </Field>
    </div>
  )
}

export default Multiple
