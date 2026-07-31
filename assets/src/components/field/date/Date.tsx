import { useEffect, useMemo, useState } from 'react'
import { Field, DatePicker } from '@tangible/ui'
import { FieldWrapper } from '../../dynamic'

/**
 * Single date field on TUI's DatePicker.
 *
 * Value contract preserved: dates are stored as "YYYY-MM-DD" strings. TUI's
 * DatePicker works in native Date objects with wall-clock semantics (no
 * timezone), so we bridge with a plain parse/format at the boundary — building
 * the Date from local Y/M/D avoids any UTC drift.
 *
 * futureOnly: `min` disables past days in the calendar, and stored/selected
 * past values are clamped to today (the clamp is applied once at init and on
 * change, never in render, to avoid the re-render loop that bit the old impl).
 *
 * Dynamic values are preserved via FieldWrapper (as with the number field): when
 * a dynamic value is set it replaces the picker; otherwise the picker + its
 * hidden input render.
 */

/** "YYYY-MM-DD" -> wall-clock Date (local midnight), or null. */
const parseDate = (str: unknown): Date | null => {
  const parts = String(str ?? '').split('-')
  if (parts.length !== 3) return null
  const [y, m, d] = parts.map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

/** Date -> "YYYY-MM-DD" (wall-clock), or '' for null. */
const formatDate = (date: Date | null): string => {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const DateField = (props: any) => {
  const hasFutureOnly = props.futureOnly === true

  const today = useMemo(() => {
    const t = new Date()
    return new Date(t.getFullYear(), t.getMonth(), t.getDate())
  }, [])

  // Clamp a past value up to today when futureOnly (defensive — `min` already
  // blocks selecting past days, but a stored value could predate it).
  const clamp = (date: Date | null): Date | null =>
    hasFutureOnly && date && date < today ? today : date

  // Clamp the initial stored value once, at init.
  const [value, setValue] = useState<string>(() => {
    const clamped = clamp(parseDate(props.value))
    return clamped ? formatDate(clamped) : props.value ?? ''
  })

  useEffect(() => {
    props.onChange && props.onChange(value)
  }, [value])

  const dateValue = useMemo(() => parseDate(value), [value])
  const disabled = Boolean(props.readOnly)

  const handleChange = (date: Date) => {
    setValue(formatDate(clamp(date)))
  }

  return (
    <div className="tf-date-picker">
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
              <DatePicker
                value={dateValue}
                onChange={handleChange}
                min={hasFutureOnly ? today : undefined}
                disabled={disabled}
                aria-label={props.label ?? 'Date'}
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

export default DateField
