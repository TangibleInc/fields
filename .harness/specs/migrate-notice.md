# Migrate Notice — Fields → TUI

**File:** `assets/src/components/base/notice/Notice.tsx` (~11 lines)
**TUI component:** `Notice` from `@tangible/ui`
**TUI ref:** N/A (compound component)

## Current implementation
- Extremely simple: renders a `<div>` with class `tf-notice`, a `<p>` for message, and a dismiss button
- Props: `message`, `type`, `onDismiss`
- No react-aria, no hooks, no state
- `type` maps to a CSS class (probably `success`, `error`, `warning`, `info`)

## Action items

### 1. Add `FieldsNoticeProps` interface
Type: `message` (ReactNode), `type` ('success' | 'error' | 'warning' | 'info'), `onDismiss` (() => void), `className`.

### 2. Replace with TUI Notice
- Import `Notice as TuiNotice` from `@tangible/ui`
- TUI Notice is a compound component: `Notice > Notice.Content + Notice.DismissButton`
- Map `type` → TUI `theme` ('success' | 'danger' | 'warning' | 'info') — note `error` → `danger`
- Map `message` → `Notice.Content` children
- Map `onDismiss` → TUI Notice `onDismiss` prop (or dismiss button onClick)
- TUI Notice handles exit animation — check if Fields callers expect synchronous unmount

### 3. Check TUI Notice API
TUI Notice uses:
- `theme` prop for colour
- `dismissible` prop (boolean) to show dismiss button
- `onDismiss` callback
- `Notice.Content` for body
- `Notice.Title` for optional heading

Map Fields' simple API to TUI compound:
```tsx
<TuiNotice theme={mappedTheme} dismissible onDismiss={onDismiss}>
  <TuiNotice.Content>{message}</TuiNotice.Content>
</TuiNotice>
```

### 4. Add `forwardRef`
Forward ref to TUI Notice root.

### 5. Legacy class preservation
If Fields CSS targets `.tf-notice` for custom styling, add `className="tf-notice"` to the TUI Notice wrapper or document the migration.
