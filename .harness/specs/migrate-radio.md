# Migrate Radio/RadioGroup — Fields → TUI

**Files:**
- `assets/src/components/field/radio/Radio.tsx` (~25 lines)
- `assets/src/components/field/radio/RadioGroup.tsx` (~65 lines)
**TUI components:** `Radio`, `RadioGroup` from `@tangible/ui`
**TUI ref:** Radio forwards to `<input>`, RadioGroup forwards to `<div>`
**TUI callback:** `onValueChange(value: string)` on RadioGroup

## Current implementation
- RadioGroup uses `useRadioGroup` (react-aria) + `useRadioGroupState` (react-stately)
- Radio uses `useRadio` (react-aria) + context from RadioGroup
- onChange-on-mount bug in RadioGroup: `useEffect(() => { props.onChange && props.onChange(state.selectedValue) }, [state.selectedValue])`
- Both untyped
- Custom Label/Description from `../../base`
- RadioContext shared via `createContext`

## Action items

### 1. Add `FieldsRadioGroupProps` and `FieldsRadioProps` interfaces
RadioGroup: `value`, `onChange`, `label`, `description`, `isDisabled`, `isRequired`, `name`, `className`, `children`.
Radio: `value`, `children`, `isDisabled`.

### 2. Replace RadioGroup with TUI RadioGroup
- Import `RadioGroup as TuiRadioGroup` and `Field` from `@tangible/ui`
- Map `onChange(selectedValue)` → TUI `onValueChange(value)`
- TUI RadioGroup manages context internally — remove `RadioContext` and `createContext`
- Wrap in `Field` compound for label/description

### 3. Replace Radio with TUI Radio
- Import `Radio as TuiRadio` from `@tangible/ui`
- TUI Radio gets value from RadioGroup context — just pass `value` and `children`
- Remove `useRadio` hook and manual `inputProps` spreading

### 4. Fix onChange mount-fire bug in RadioGroup
Add `mountedRef` guard.

### 5. Add hidden input for PHP form submission
`<input type="hidden" name={name} value={selectedValue}>` in RadioGroup.

### 6. Add `forwardRef` to both components
RadioGroup → `<div>`, Radio → `<input>`.

### 7. Preserve exports
Both `RadioGroup` and `RadioContext` are currently named exports. After migration, `RadioContext` can be removed (TUI handles it internally), but check for external imports first: `grep -r "RadioContext" assets/src/`.
