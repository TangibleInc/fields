import {
  forwardRef,
  useEffect,
  useState
} from 'react'

import { Switch as TuiSwitch, Field } from '@tangible/ui'

export interface FieldsSwitchProps {
  value?: boolean | '1' | '0'
  onChange?: (value: boolean) => void
  label?: string
  labelVisuallyHidden?: boolean
  description?: string
  descriptionVisuallyHidden?: boolean
  isDisabled?: boolean
  name?: string
  className?: string
}

const Switch = forwardRef<HTMLButtonElement, FieldsSwitchProps>((props, ref) => {

  const {
    value,
    onChange,
    label,
    labelVisuallyHidden,
    description,
    descriptionVisuallyHidden,
    isDisabled,
    name,
    className,
  } = props

  const boolValue = value === '1' || value === true
  const [checked, setChecked] = useState(boolValue)

  useEffect(() => {
    if (boolValue !== checked) setChecked(boolValue)
  }, [boolValue])

  const labelContent = label
    ? labelVisuallyHidden
      ? <span className="tui-visually-hidden">{label}</span>
      : label
    : undefined

  return (
    <div className="tf-switch">
      <Field
        className={className}
        disabled={Boolean(isDisabled)}
      >
        <TuiSwitch
          ref={ref}
          label={labelContent}
          checked={checked}
          disabled={Boolean(isDisabled)}
          onCheckedChange={nextChecked => {
            setChecked(nextChecked)
            if (onChange) onChange(nextChecked)
          }}
        />
        <input type="hidden" name={name ?? ''} value={checked ? '1' : '0'} />
        {description && (
          <Field.HelperText className={descriptionVisuallyHidden ? 'tui-visually-hidden' : undefined}>
            {description}
          </Field.HelperText>
        )}
      </Field>
    </div>
  )
})

export default Switch
