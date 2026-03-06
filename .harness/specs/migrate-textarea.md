# Migrate Textarea — Fields → TUI

**File:** `assets/src/components/field/textarea/Textarea.tsx` (~95 lines)
**TUI component:** `Textarea` from `@tangible/ui`
**TUI ref:** `forwardRef<HTMLTextAreaElement>`
**TUI callback:** Native `onChange` (standard `ChangeEvent<HTMLTextAreaElement>`)

## Current implementation
- Uses `useTextField` with `inputElementType: 'textarea'` (react-aria)
- Two paths: dynamic (ProseMirror DynamicEditor) and native `<textarea>`
- Has onChange-on-mount bug: `useEffect(() => { if (props.onChange) props.onChange(value) }, [value])`
- `useTextField` called unconditionally (same issue Text.tsx had — dead code in dynamic path)
- Untyped (`(props) =>`)
- Custom Label/Description from `../../base`

## Action items

### 1. Add `FieldsTextareaProps` interface
Type all used props: `dynamic`, `value`, `onChange`, `name`, `label`, `labelVisuallyHidden`, `description`, `descriptionVisuallyHidden`, `placeholder`, `readOnly`, `isDisabled`, `isRequired`, `isInvalid`, `error`, `className`, `maxlength`, `minlength`, `rows`, `required`, `identifier`.

### 2. Extract `DynamicTextarea` sub-component
Same pattern as Text.tsx — isolate `useTextField` in a sub-component for the dynamic path. Main component early-returns to dynamic when `hasDynamic` is true.

### 3. Replace native `<textarea>` path with TUI Textarea
- Import `Textarea as TuiTextarea` and `Field` from `@tangible/ui`
- TUI Textarea accepts native textarea props (`placeholder`, `readOnly`, `rows`, `maxLength`, `minLength`, `required`, `name`, `value`, `onChange`)
- TUI `onChange` is native — map Fields `onChange(value: string)` by extracting `event.target.value`
- Wrap in `Field` compound for label/description/error/disabled
- Pass `size` prop through

### 4. Fix onChange mount-fire bug
Add `mountedRef` guard (same pattern as Text.tsx).

### 5. Add `forwardRef<HTMLTextAreaElement>`
Forward ref to TUI Textarea.

### 6. Remove `useTextField` from main component
Only needed in `DynamicTextarea` sub-component. Main component no longer calls react-aria hooks.

### 7. Preserve `data-identifier`
The native path passes `data-identifier={props.identifier}`. Check if TUI Textarea forwards arbitrary data attributes via `...rest`. If yes, pass it through. If not, add via ref after mount or request TUI support.
