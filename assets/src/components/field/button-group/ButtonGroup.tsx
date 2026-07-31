import { useState } from 'react'
import { Field, SegmentedControl } from '@tangible/ui'
import { getOptions } from '../../../utils'

/**
 * button-group is a single-select radiogroup rendered as segments — now on TUI's
 * SegmentedControl. Value contract preserved: the selected key. A hidden input
 * carries it for form submission (react-aria's native radios did this before).
 */
const ButtonGroup = (props: any) => {
  const options = getOptions(props.choices ?? {})
  const [value, setValue] = useState<string | number | undefined>(props.value ?? undefined)
  const disabled = Boolean(props.readOnly)
  const disabledKeys = (props.disabledKeys ?? []).map(String)

  const handleChange = (next: string | number) => {
    setValue(next)
    props.onChange?.(next)
  }

  return (
    <div className="tf-button-group">
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
          <SegmentedControl
            value={value}
            onValueChange={handleChange}
            disabled={disabled}
            wrap
            // Field.Control injects aria-labelledby when a Field.Label is present;
            // this is the fallback for the label-less case (SegmentedControl
            // requires one of aria-label / aria-labelledby).
            aria-label={props.label ?? 'Options'}
          >
            {options.map((option) =>
              props.use_dashicon ? (
                <SegmentedControl.Item
                  key={option.value}
                  value={option.value}
                  disabled={disabledKeys.includes(String(option.value))}
                  aria-label={String(option.label)}
                  icon={<span className={`dashicons dashicons-${option.label}`} />}
                />
              ) : (
                <SegmentedControl.Item
                  key={option.value}
                  value={option.value}
                  disabled={disabledKeys.includes(String(option.value))}
                >
                  {option.label}
                </SegmentedControl.Item>
              )
            )}
          </SegmentedControl>
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

export default ButtonGroup
