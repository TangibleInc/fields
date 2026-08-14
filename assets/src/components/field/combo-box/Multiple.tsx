import { useRef } from 'react'
import { Field, MultiCombobox } from '@tangible/ui'
import { useComboboxData } from './useComboboxData'
import { renderComboOptions, flatten } from './renderOptions'

/**
 * Multi-select combo-box on TUI's MultiCombobox.
 *
 * Fields value contract preserved:
 *  - static: comma-joined values ("a,b,c")
 *  - async:  [{ value, label }]
 *
 * MultiCombobox owns the chips + search input; this wrapper feeds it options,
 * translates the selected value keys back into the Fields shape, and keeps a
 * value->label map so async chips keep their labels across searches.
 */
const Multiple = (props: any) => {
  const { options, loading, isAsync, onInputChange, ensureLoaded } = useComboboxData(props)

  const selectedItems: any[] = isAsync && Array.isArray(props.value) ? props.value : []
  const keys: (string | number)[] = isAsync
    ? selectedItems.map((i) => i.value)
    : String(props.value ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

  // value -> label map; seeded from the initial async items, merged from options.
  const labelMapRef = useRef<Map<string, string>>(new Map())
  if (isAsync) {
    for (const it of selectedItems) {
      if (it?.value != null) labelMapRef.current.set(String(it.value), it.label ?? String(it.value))
    }
  }
  for (const opt of flatten(options)) labelMapRef.current.set(String(opt.value), opt.label)
  const labelFor = (key: string | number) => labelMapRef.current.get(String(key)) ?? String(key)

  const disabled = Boolean(props.readOnly)

  const handleValueChange = (newKeys: (string | number)[]) => {
    if (isAsync) {
      props.onChange?.(newKeys.map((k) => ({ value: k, label: labelFor(k) })))
    } else {
      props.onChange?.(newKeys.join(','))
    }
  }

  return (
    <div className="tf-combo-box tf-combo-box-multiple">
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
          <MultiCombobox
            value={keys}
            onValueChange={handleValueChange}
            onInputChange={onInputChange}
            onOpenChange={(open) => open && ensureLoaded()}
            placeholder={props.placeholder}
            disabled={disabled}
          >
            <MultiCombobox.Content>
              {renderComboOptions(options, {
                loading,
                disabledKeys: props.disabledKeys,
                parts: {
                  Option: MultiCombobox.Option,
                  Group: MultiCombobox.Group,
                  Label: MultiCombobox.Label,
                },
              })}
            </MultiCombobox.Content>
          </MultiCombobox>
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
