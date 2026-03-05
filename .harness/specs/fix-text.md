# Fix Text.tsx — Action Items

**File:** `assets/src/components/field/text/Text.tsx`

## 1. Add `FieldsTextProps` interface and type the component

**Problem:** Line 27 declares `const TextField = props => {` with no type annotation. All prop access is untyped.

**Fix:** Define an interface covering all used props:

```tsx
export interface FieldsTextProps {
  dynamic?: boolean | string | object
  inputMask?: string
  prefix?: string
  suffix?: string
  value?: string
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
  size?: 'sm' | 'md' | 'lg'
  type?: string
}
```

Type the component: `const TextField = forwardRef<HTMLInputElement, FieldsTextProps>((props, ref) => {`

(forwardRef is also item 4 — can be done together.)

## 2. Fix `onChange` via `useEffect` firing on mount

**Problem:** Lines 49-51:
```tsx
useEffect(() => {
  if (props.onChange) props.onChange(value)
}, [value])
```

This fires on mount with the initial value, which triggers the Fields store to write-back the initial value. This can cause flickering and unnecessary re-renders, and in some cases overwrites server-side values.

**Fix:** Add a `mountedRef` guard:
```tsx
const mountedRef = useRef(false)

useEffect(() => {
  if (!mountedRef.current) {
    mountedRef.current = true
    return
  }
  if (props.onChange) props.onChange(value)
}, [value])
```

**Note:** This same bug exists in `Control.tsx` (lines 37-39). Don't fix it here — it's a broader systemic issue. Just fix Text.tsx.

## 3. Move `useTextField` call inside `if (hasDynamic)` block

**Problem:** Lines 41-45 call `useTextField(props, ref)` unconditionally, but the return values (`labelProps`, `inputProps`, `descriptionProps`) are only used in the dynamic/ProseMirror path (lines 63-89). In the TUI path, TUI's `Field` compound handles label/description association.

**Fix:** Move the `useTextField` call and its destructured values inside the `if (hasDynamic)` block. This avoids running react-aria hooks unnecessarily in the TUI path and removes a potential source of conflicting ARIA attributes.

**Important:** React hooks can't be called conditionally in the same component. Options:
- Split into two sub-components: `DynamicTextField` and `NativeTextField`
- Or wrap the hook call in a custom component that only renders in dynamic mode

Preferred approach: early return pattern. Move the dynamic path to the top with its own hooks:

```tsx
if (hasDynamic) {
  return <DynamicTextField {...props} />
}
// TUI path below — no useTextField needed
```

Where `DynamicTextField` is a small internal component that calls `useTextField`.

## 4. Add `forwardRef<HTMLInputElement>`

**Problem:** TextField doesn't forward refs. Consuming code can't get a handle on the underlying input.

**Fix:** Wrap with `forwardRef<HTMLInputElement, FieldsTextProps>`. In the TUI path, pass `ref` to `TuiTextInput`. In the dynamic path, the ref can go to the ProseMirror wrapper or be unused (document the limitation).

```tsx
const TextField = forwardRef<HTMLInputElement, FieldsTextProps>((props, ref) => {
  // ...
  // TUI path:
  <TuiTextInput ref={ref} ... />
})
```

## 5. Remove `querySelector('input')` hack for inputMaskRef

**Problem:** Lines 109-114:
```tsx
ref={node => {
  ref.current = node
  if (inputMask && node) {
    inputMaskRef.current = node.querySelector?.('input') ?? node
  }
}}
```

This reaches into TUI TextInput's DOM to find the `<input>` element. But TUI TextInput's ref IS the `<input>` element — `querySelector` is unnecessary.

**Fix:** Simplify:
```tsx
ref={node => {
  // TUI TextInput forwards ref to the <input> element directly
  if (typeof ref === 'function') ref(node)
  else if (ref) ref.current = node
  if (inputMask && node) {
    inputMaskRef.current = node
  }
}}
```

Use `mergeRefs` or a callback ref that handles both the forwarded ref and the inputMaskRef.

## 6. Add comment explaining `Field.HelperText` className approach

**Problem:** Line 129 uses a className to visually hide the helper text:
```tsx
<Field.HelperText className={props.descriptionVisuallyHidden ? 'tui-visually-hidden' : undefined}>
```

This works but isn't obvious why — `Field.HelperText` doesn't expose a `hidden` prop.

**Fix:** Add an explanatory comment:
```tsx
{/* Field.HelperText doesn't expose a `hidden` prop.
    Using tui-visually-hidden keeps the text in the a11y tree
    (associated via aria-describedby) while hiding it visually. */}
<Field.HelperText className={...}>
```
