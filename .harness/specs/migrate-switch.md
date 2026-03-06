# Migrate Switch — Fields → TUI

**File:** `assets/src/components/field/switch/Switch.tsx` (~77 lines)
**TUI component:** `Switch` from `@tangible/ui`
**TUI ref:** `forwardRef<HTMLButtonElement>`
**TUI callback:** `onCheckedChange(checked: boolean)`

## Current implementation
- Uses `useToggleState` + `useSwitch` + `useFocusRing` + `useField` (react-aria)
- Has onChange-on-mount bug: `useEffect(() => props.onChange && props.onChange(state.isSelected), [state.isSelected])`
- Has external value sync: `useEffect(() => { if (props.value !== state.isSelected) state.setSelected(props.value) }, [props.value])`
- Untyped (`props =>`)
- Custom `VisuallyHidden` input + visual toggle track/thumb
- Custom Label/Description from `../../base`

## Action items

### 1. Add `FieldsSwitchProps` interface
Type all used props: `value`, `onChange`, `label`, `labelVisuallyHidden`, `description`, `descriptionVisuallyHidden`, `isDisabled`, `name`, `className`.

### 2. Replace react-aria with TUI Switch
- Import `Switch as TuiSwitch` and `Field` from `@tangible/ui`
- Map `onChange(isSelected)` → TUI `onCheckedChange(checked)`
- Map `isDisabled` → `disabled`
- TUI Switch handles its own toggle visual — remove custom track/thumb markup
- Wrap in `Field` compound for label/description

### 3. Fix onChange mount-fire bug
Add `mountedRef` guard.

### 4. Handle controlled value
Use TUI `checked`/`defaultChecked` props mapped from `props.value`.

### 5. Add hidden input for PHP form submission
`<input type="hidden" name={name} value={checked ? '1' : '0'}>`

### 6. Add `forwardRef<HTMLButtonElement>`
TUI Switch forwards to `<button>` (not `<input>`).
