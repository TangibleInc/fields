import { useRef, useState } from 'react'
import { Field, Combobox } from '@tangible/ui'
import { useComboboxData } from './useComboboxData'
import { renderComboOptions, flatten } from './renderOptions'

/**
 * Single-select combo-box on TUI's Combobox.
 *
 * Fields value contract preserved:
 *  - static: the raw value (string)
 *  - async:  { value, label }
 *
 * TUI Combobox is controlled for both selection and the input text: on select
 * we set the input to the option's label (matching the old behaviour), and a
 * value->label map lets async selections resolve their label even after the
 * option leaves the server-filtered result set.
 */
const Single = (props: any) => {
  const { options, loading, isAsync, onInputChange, ensureLoaded } = useComboboxData(props)

  const selectedKey = isAsync ? props.value?.value ?? undefined : props.value || undefined
  const initialLabel = isAsync ? props.value?.label ?? '' : String(props.value ?? '')

  const [inputValue, setInputValue] = useState(initialLabel)

  // value -> label map; seeded from the initial value, merged from options.
  const labelMapRef = useRef<Map<string, string>>(new Map())
  if (isAsync && props.value?.value != null && props.value?.label != null) {
    labelMapRef.current.set(String(props.value.value), props.value.label)
  }
  for (const opt of flatten(options)) labelMapRef.current.set(String(opt.value), opt.label)
  const labelFor = (key: string | number) => labelMapRef.current.get(String(key)) ?? String(key)

  const disabled = Boolean(props.readOnly)

  const handleValueChange = (key: string | number | undefined) => {
    if (key === undefined) {
      setInputValue('')
      props.onChange?.(isAsync ? undefined : '')
      return
    }
    const label = labelFor(key)
    setInputValue(label)
    props.onChange?.(isAsync ? { value: key, label } : key)
  }

  const handleInputChange = (text: string) => {
    setInputValue(text)
    onInputChange(text)
  }

  return (
    <div className="tf-combo-box tf-combo-box-single">
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
          <Combobox
            value={selectedKey}
            onValueChange={handleValueChange}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onOpenChange={(open) => open && ensureLoaded()}
            placeholder={props.placeholder}
            disabled={disabled}
          >
            <Combobox.Content>
              {renderComboOptions(options, {
                loading,
                disabledKeys: props.disabledKeys,
                parts: {
                  Option: Combobox.Option,
                  Group: Combobox.Group,
                  Label: Combobox.Label,
                },
              })}
            </Combobox.Content>
          </Combobox>
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
