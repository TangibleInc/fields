import { useState } from 'react'
import { Field, Select } from '@tangible/ui'
import { getOptions } from '../../../utils'
import { renderSelectOptions } from './renderOptions'

/**
 * Single-select on TUI's Select. Value contract preserved: the raw key.
 * A hidden input carries the value for form submission (replaces react-aria's
 * HiddenSelect).
 */
const Single = (props: any) => {
  const options = getOptions(props.choices ?? {})
  const [value, setValue] = useState<string | number | undefined>(props.value || undefined)
  const disabled = Boolean(props.readOnly)

  const handleChange = (next: string | number | undefined) => {
    setValue(next)
    props.onChange?.(next ?? '')
  }

  return (
    <div className="tf-select-field tf-select-single">
      <input type="hidden" name={props.name ?? ''} value={value ?? ''} />
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
          <Select
            value={value}
            onValueChange={handleChange}
            placeholder={props.placeholder ?? 'Select an option'}
            disabled={disabled}
          >
            <Select.Trigger />
            <Select.Content>
              {renderSelectOptions(options, {
                disabledKeys: props.disabledKeys,
                parts: { Option: Select.Option, Group: Select.Group, Label: Select.Label },
              })}
            </Select.Content>
          </Select>
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

export default Single
