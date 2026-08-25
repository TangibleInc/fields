import { useRef, useState, useEffect, forwardRef } from 'react'

import { Field, SecretInput } from '@tangible/ui'
import type { SizeStandard, SecretInputLabels } from '@tangible/ui'

/**
 * Password field — stored secrets (API keys, tokens) that are never sent to
 * the browser.
 *
 * The field exists to enforce a server-side contract, not just to mask
 * characters. `type: 'text'` with `type="password"` on the input would look
 * identical and still put the stored key in the page source.
 *
 * 1. The server sends `value_is_set` — a boolean saying a value exists — and
 *    never the value itself. This field therefore has no `value` in its config;
 *    one passed anyway is dropped (with a dev warning), because honouring it
 *    would reintroduce exactly the leak the field type exists to prevent.
 * 2. An untouched field submits empty, and the save handler reads empty as
 *    "keep the stored value". Typing replaces; clearing is a separate,
 *    explicit action the consumer provides.
 * 3. `locked` marks a value defined outside this screen (a wp-config constant):
 *    read-only, no reveal toggle, still focusable and readable by AT.
 *
 * @see https://github.com/TangibleInc/tangible-ui — SecretInput
 */

export interface FieldsPasswordProps {
  /** A value exists server-side. Renders the set-state while the input is empty. */
  isSet?: boolean
  /** Managed outside this screen — read-only, lock icon, no reveal toggle. */
  locked?: boolean
  /** Why the field is locked, e.g. "Defined in wp-config.php." */
  lockedMessage?: string
  /** Overridable strings for i18n — see SecretInput's `labels`. */
  labels?: SecretInputLabels
  /** Reveal state, for consumers enforcing a re-mask policy. */
  revealed?: boolean
  defaultRevealed?: boolean
  onRevealChange?: (revealed: boolean) => void

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

  /**
   * Never rendered. Declared only so a caller passing one gets the warning
   * rather than a silently leaking field.
   */
  value?: string
}

const PasswordField = forwardRef<HTMLInputElement, FieldsPasswordProps>((props, ref) => {

  /**
   * Always starts empty, regardless of what was passed. `props.value` is not a
   * seed here — the value the user types is the only value this field ever has.
   */
  const [value, setValue] = useState('')
  const mountedRef = useRef(false)

  /**
   * Mount only. Control feeds its own state back down as `value`, so anything
   * the user types would otherwise trip this on the next render.
   *
   * Deliberately not gated on isDev(): a config that would leak a stored secret
   * is worth saying out loud wherever it happens, and reaching this in
   * production means the PHP-side strip was bypassed entirely.
   */
  useEffect(() => {
    if (typeof props.value === 'string' && props.value !== '') {
      console.warn(
        '[Tangible Fields] A `password` field was given a `value`. It has been dropped: ' +
        'stored secrets must not reach the browser. Send `value_is_set => (bool) $stored` ' +
        'instead, and treat an empty submitted value as "keep the stored value".'
      )
    }
  }, [])

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      return
    }
    if (props.onChange) props.onChange(value)
  }, [value])

  return (
    <div className="tf-password">
      <Field
        className={props.className}
        required={Boolean(props.isRequired)}
        disabled={Boolean(props.isDisabled)}
        error={Boolean(props.isInvalid || props.error)}
      >
        {props.label &&
          <Field.Label hidden={Boolean(props.labelVisuallyHidden)}>
            {props.label}
          </Field.Label>}
        <Field.Control>
          <SecretInput
            ref={ref}
            inputClassName={props.inputClassName}
            size={props.size}
            isSet={Boolean(props.isSet)}
            locked={Boolean(props.locked)}
            lockedMessage={props.lockedMessage}
            labels={props.labels}
            revealed={props.revealed}
            defaultRevealed={props.defaultRevealed}
            onRevealChange={props.onRevealChange}
            placeholder={props.placeholder}
            readOnly={props.readOnly}
            value={value}
            onChange={event => setValue(event.target.value)}
            name={props.name ?? ''}
          />
        </Field.Control>
        {props.description &&
          <Field.HelperText className={props.descriptionVisuallyHidden ? 'tui-visually-hidden' : undefined}>
            {props.description}
          </Field.HelperText>}
      </Field>
    </div>
  )
})

export default PasswordField
