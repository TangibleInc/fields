import { useEffect, useState } from 'react'
import { Field, TextInput, Select } from '@tangible/ui'
import { initJSON } from '../../../utils'

/**
 * simple-dimension = one number + a unit — a composite of TUI TextInput
 * (type=number) and TUI Select. Value contract preserved: { value, unit }, JSON
 * in the hidden input.
 *
 * The Field label is a group label (two controls), so it lands on a
 * role="group" wrapper; each control carries its own aria-label.
 */
const SimpleDimension = (props: any) => {
  const units: string[] = props.units ?? ['px']
  const [value, setValue] = useState<any>(() =>
    initJSON(props.value ?? '', { value: 0, unit: units[0] })
  )

  useEffect(() => {
    props.onChange && props.onChange(value)
  }, [value])

  const setAttr = (attr: string, v: any) => setValue((prev: any) => ({ ...prev, [attr]: v }))
  const disabled = Boolean(props.readOnly)

  return (
    <div className="tf-simple-dimensions">
      <input type="hidden" name={props.name ?? ''} value={JSON.stringify(value)} />
      <Field className={props.className} disabled={disabled} error={Boolean(props.isInvalid)}>
        {props.label && (
          <Field.Label hidden={Boolean(props.labelVisuallyHidden)}>{props.label}</Field.Label>
        )}
        <Field.Control>
          <div role="group" className="tf-dimension-row">
            <TextInput
              type="number"
              value={value.value ?? 0}
              onChange={(e) => setAttr('value', e.target.value)}
              aria-label="Dimension number"
              disabled={disabled}
              className="tf-dimension-number"
            />
            <Select
              value={value.unit ?? units[0]}
              onValueChange={(u) => setAttr('unit', u)}
              aria-label="Dimension unit"
              disabled={disabled}
            >
              <Select.Trigger />
              <Select.Content>
                {units.map((u) => (
                  <Select.Option key={u} value={u}>
                    {u}
                  </Select.Option>
                ))}
              </Select.Content>
            </Select>
          </div>
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

export default SimpleDimension
