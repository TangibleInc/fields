# Wrapper Contract — Fields → TUI

Reference document for every Fields→TUI component wrapper. All wrappers must follow these conventions.

## TypeScript

```tsx
export interface Fields{Component}Props extends Partial<Tui{Component}Props> {
  // Fields-specific props (legacy API surface)
  layout?: string
  onChange?: (value: T) => void
  // ... destructured and mapped to TUI equivalents
}

const Component = forwardRef<HTMLElement, Fields{Component}Props>((props, ref) => {
  // ...
})
```

- Define `Fields{Component}Props` interface for every wrapper
- Use `forwardRef` with a typed ref matching what TUI forwards
- Destructure known Fields-specific props; spread remaining `...tuiProps` to TUI component

## Props mapping

| Fields prop | TUI prop | Notes |
|---|---|---|
| `onChange(value)` | `onValueChange(value)` | For value-producing components |
| `onChange(value)` | `onCheckedChange(checked)` | For Checkbox, Switch |
| `isDisabled` | `disabled` | Boolean coercion |
| `isRequired` | TUI `Field` `required` prop | Used on Field wrapper |
| `isInvalid` / `error` | TUI `Field` `error` prop | Boolean coercion |
| `layout` / `type` | `theme` + `variant` | Via layout map (Button-specific) |
| `readOnly` | `readOnly` | Pass through |
| `labelVisuallyHidden` | `Field.Label hidden` prop | |

## Field compound pattern

All field-type wrappers (inputs, selects, etc.) must use TUI's Field compound:

```tsx
<Field required={...} disabled={...} error={...}>
  <Field.Label hidden={labelVisuallyHidden}>{label}</Field.Label>
  <Field.Control>
    <TuiComponent ref={ref} {...mappedProps} />
  </Field.Control>
  <Field.HelperText>{description}</Field.HelperText>
</Field>
```

## Dev warnings

Use `useRef` guard to fire warnings **once per component instance on mount**, not per render and not via module-level flags.

```tsx
import { isDev } from '../../../utils/is-dev'

const hasWarned = useRef(false)

useEffect(() => {
  if (!hasWarned.current && isDev()) {
    if (problematicCondition) {
      console.warn('[Fields Component] Warning message.')
      hasWarned.current = true
    }
  }
}, [])
```

**Why not module-level flags?** Module-level `let hasWarned = false` fires once globally across all instances. If two Buttons have the same issue, only the first logs. `useRef` scopes the warning to each instance.

## No TUI internal access

**Never** use `querySelector`, `getElementsByClassName`, or any DOM traversal into TUI component internals. TUI components forward refs to their primary element:

- `Button` → `<button>` or `<a>`
- `TextInput` → `<input>`
- `Select` → trigger `<button>`

If you need a child element that isn't ref-forwarded, file an issue on TUI — don't hack around it.

## Hidden inputs for PHP form submission

When a TUI component doesn't render a native `<input>` with `name` (e.g., Select, MultiSelect, Checkbox), the wrapper must include:

```tsx
<input type="hidden" name={name} value={serialisedValue} />
```

This ensures PHP form handlers receive the value on submit. TextInput and native inputs don't need this — they already have a `name` attribute.

## Legacy fallback

When a Fields prop combination doesn't map cleanly to TUI, fall back to the legacy component:

```tsx
if (!isMappedLayout(resolvedLayout)) {
  return <LegacyButton ref={ref} {...props} />
}
```

Gate on the specific condition. Don't wrap the entire TUI path in try/catch.
