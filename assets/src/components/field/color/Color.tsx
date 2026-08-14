import { useEffect, useState } from 'react'
import { Field, ColorField } from '@tangible/ui'
import { FieldWrapper } from '../../dynamic'

/**
 * Color field on TUI's ColorField (swatch trigger + popover picker).
 *
 * Value contract preserved: colors are stored as CSS color strings, and a
 * legacy `{ value }` object is unwrapped on the way in. Empty/missing values
 * default to #FFFFFF like the old react-aria implementation (which emitted
 * #FFFFFFFF — TUI's hex omits the alpha byte when fully opaque).
 *
 * Legacy config options are mapped: `hasAlpha` -> `alpha`, and the old
 * react-stately `format` names ('hexa', 'rgba', 'hsla', …) -> TUI formats.
 * TUI also accepts and preserves `var(--x)` values.
 *
 * New opt-in: `gradient: true` adds Solid|Gradient tabs to the popover and
 * lets the value be a CSS gradient string (the Figma "Color Selector").
 *
 * Dynamic values are preserved via FieldWrapper (as with date/number): when a
 * dynamic value is set it replaces the control; otherwise the trigger + its
 * hidden input render.
 */

/** Legacy react-stately format names -> TUI ColorFormat. */
const FORMAT_MAP = {
  hex: 'hex',
  hexa: 'hex',
  rgb: 'rgb',
  rgba: 'rgb',
  hsl: 'hsl',
  hsla: 'hsl',
} as const

const Color = props => {

  const [value, setValue] = useState<string>(() => {
    // Legacy values sometimes arrive as { value } objects.
    const initial = typeof props.value === 'object' ? props.value?.value : props.value
    return initial || '#FFFFFF'
  })

  useEffect(() => {
    props.onChange && props.onChange(value)
  }, [value])

  const disabled = Boolean(props.readOnly)
  const defaultFormat = FORMAT_MAP[props.format as keyof typeof FORMAT_MAP] ?? 'hex'

  return (
    <div className="tf-color">
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
          <FieldWrapper {...props} value={value} onValueSelection={setValue}>
            <>
              {/* Hidden input lives with the picker so it's absent when a
                  dynamic value replaces the control (FieldWrapper owns that
                  submission path). */}
              <input type="hidden" name={props.name ?? ''} value={value ?? ''} />
              {/* Explicit aria-label (as with the date field): Field.Control's
                  aria-labelledby injection lands on FieldWrapper, which doesn't
                  forward it to its children. */}
              <ColorField
                value={value}
                onValueChange={setValue}
                alpha={props.hasAlpha ?? true}
                defaultFormat={defaultFormat}
                gradient={Boolean(props.gradient)}
                disabled={disabled}
                aria-label={props.label ?? 'Color'}
              />
            </>
          </FieldWrapper>
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

export default Color
