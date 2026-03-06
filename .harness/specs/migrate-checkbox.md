# Migrate Checkbox — Fields → TUI

**File:** `assets/src/components/field/checkbox/Checkbox.tsx` (~82 lines)
**TUI component:** `Checkbox` from `@tangible/ui`
**TUI ref:** `forwardRef<HTMLInputElement>`
**TUI callback:** `onCheckedChange(checked: boolean)`

## Current implementation
- Uses `useToggleState` (react-stately) + `useCheckbox` (react-aria) + `useField`
- Has onChange-on-mount bug: `useEffect(() => props.onChange && props.onChange(state.isSelected), [state.isSelected])`
- Has dangerous `useEffect` on `props.value` that can cause infinite re-renders
- Untyped (`props =>`)
- Custom Label/Description components from `../../base`
- `VisuallyHidden` input pattern

## Action items

### 1. Add `FieldsCheckboxProps` interface
Type all used props: `value`, `onChange`, `label`, `labelVisuallyHidden`, `description`, `descriptionVisuallyHidden`, `isDisabled`, `isRequired`, `name`, `className`.

### 2. Replace react-aria with TUI Checkbox
- Import `Checkbox as TuiCheckbox` and `Field` from `@tangible/ui`
- Map `onChange(isSelected)` → TUI `onCheckedChange(checked)`
- Map `isDisabled` → `disabled`
- TUI Checkbox renders its own label via `children` — pass `props.label` as child
- Wrap in `Field` compound for label/description when Fields label/description are present

### 3. Fix onChange mount-fire bug
Add `mountedRef` guard (same pattern as Text.tsx fix).

### 4. Handle `props.value` sync
The dangerous `useEffect` on `props.value` exists because repeaters externally set checkbox state. Replace with TUI's controlled pattern:
- Use `checked` prop (TUI) mapped from `props.value`
- Use `defaultChecked` when no value control needed

### 5. Add hidden input for PHP form submission
TUI Checkbox renders a native `<input type="checkbox">` internally, but Fields needs `<input type="hidden" name={name} value={checked ? '1' : '0'}>` for PHP form serialisation. Add alongside the TUI component.

### 6. Add `forwardRef<HTMLInputElement>`
Forward ref to TUI Checkbox.

### 7. Import `isDev` and add dev warning for deprecated patterns
Warn when `props.value` is used to externally control state (the dangerous pattern).
