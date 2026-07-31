import { useEffect, useState } from 'react'
import { Field, TextInput, Select, IconButton } from '@tangible/ui'
import { initJSON } from '../../../utils'

const SIDES = ['top', 'left', 'right', 'bottom'] as const

/**
 * dimensions = four sides + a unit + a link/unlink toggle — a composite of TUI
 * TextInput (type=number) × 4, TUI Select, and a TUI IconButton. Value contract
 * preserved: { top, left, right, bottom, unit, isLinked }, JSON in the hidden
 * input. Linked mode syncs all four sides to the edited value.
 */
const Dimensions = (props: any) => {
  const units: string[] = props.units ?? ['px']
  const showToggle = props.linked === 'toggle' || props.linked === undefined

  const [value, setValue] = useState<any>(() =>
    initJSON(props.value ?? '', {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      unit: units[0],
      isLinked: false,
    })
  )

  useEffect(() => {
    props.onChange && props.onChange(value)
  }, [value])

  // Sync all sides to `top` when linking turns on.
  useEffect(() => {
    if (value.isLinked) setLinkedPosition(value.top)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.isLinked])

  const setAttribute = (attr: string, v: any) => setValue((prev: any) => ({ ...prev, [attr]: v }))
  const setLinkedPosition = (n: any) =>
    setValue((prev: any) => ({ ...prev, top: n, left: n, right: n, bottom: n }))
  const setIsLinked = (state: boolean) => setValue((prev: any) => ({ ...prev, isLinked: state }))

  // Only rely on the saved flag when the toggle is shown; otherwise the prop.
  const isLinked = () => (showToggle ? value.isLinked ?? false : props.linked)

  const disabled = Boolean(props.readOnly)

  return (
    <div className="tf-dimensions">
      <input type="hidden" name={props.name ?? ''} value={JSON.stringify(value)} />
      <Field className={props.className} disabled={disabled} error={Boolean(props.isInvalid)}>
        {props.label && (
          <Field.Label hidden={Boolean(props.labelVisuallyHidden)}>{props.label}</Field.Label>
        )}
        <Field.Control>
          <div role="group" className="tf-dimensions-row">
            <div className={`tf-dimensions-sides${isLinked() ? ' is-linked' : ''}`}>
              {SIDES.map((side) => (
                <TextInput
                  key={side}
                  type="number"
                  value={value[side] ?? 0}
                  onChange={(e) =>
                    isLinked() ? setLinkedPosition(e.target.value) : setAttribute(side, e.target.value)
                  }
                  aria-label={`Value for ${side}`}
                  disabled={disabled}
                  className="tf-dimension-number"
                />
              ))}
            </div>
            <Select
              value={value.unit ?? units[0]}
              onValueChange={(u) => setAttribute('unit', u)}
              aria-label="Dimensions unit"
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
            {showToggle && (
              <IconButton
                icon={value.isLinked ? 'system/link' : 'system/unlink'}
                label={value.isLinked ? 'Unlink sides' : 'Link sides'}
                variant="outline"
                disabled={disabled}
                onClick={() => setIsLinked(!value.isLinked)}
              />
            )}
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

export default Dimensions
