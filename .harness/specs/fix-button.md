# Fix Button.tsx — Action Items

**File:** `assets/src/components/base/button/Button.tsx`

## 1. Module-level warning flags → `useRef` guards

**Problem:** Lines 33-34 use module-level `let hasWarnedAboutSpanButton = false` and `let hasWarnedAboutMissingLabel = false`. These are global singletons — if two Button instances have the same problem, only the first logs a warning.

**Fix:** Replace both with `useRef(false)` inside the component body. Check in a `useEffect([], [])` (mount only) or inline before the warning fires.

**Before:**
```tsx
let hasWarnedAboutSpanButton = false
// ...
if (!hasWarnedAboutSpanButton && isDevBuild) {
  hasWarnedAboutSpanButton = true
```

**After:**
```tsx
const hasWarnedSpan = useRef(false)
// ...
if (!hasWarnedSpan.current && isDev()) {
  hasWarnedSpan.current = true
```

Remove the module-level `let` declarations entirely.

## 2. Replace hand-rolled `isDevBuild` with shared `isDev()` utility

**Problem:** Lines 35-37 define a local `isDevBuild` constant with a verbose `globalThis.process?.env?.NODE_ENV` check. This is duplicated logic.

**Fix:** Import `isDev` from `../../../utils/is-dev` and replace all `isDevBuild` references with `isDev()`. Delete lines 35-37.

## 3. Move `destructive → danger` normalisation before branch split

**Problem:** Line 202 normalises `resolvedTheme === 'destructive'` to `'danger'`, but only inside the `changeTag === 'span'` branch. The TUI `<TuiButton>` path (line 253) passes `resolvedTheme` directly, which could be `'destructive'` — TUI Button doesn't recognise that theme value.

**Fix:** Add normalisation after `resolvedTheme` is computed (around line 167):
```tsx
const resolvedTheme = (theme ?? mapped.theme) === 'destructive'
  ? 'danger'
  : (theme ?? mapped.theme)
```

Then remove the duplicate normalisation inside the span branch (line 202).

## 4. Add fragility comment to `changeTag="span"` branch

**Problem:** The span branch (lines 194-246) manually replicates TUI Button's CSS class contract (`tui-button`, `is-size-*`, `is-theme-*`, `is-style-*`). If TUI renames these classes, the span branch silently breaks.

**Fix:** The existing comment on line 203-204 is good but brief. Expand it or add a `@fragile` annotation:
```tsx
/**
 * @fragile This span branch manually replicates TUI Button's class contract.
 * If TUI changes its class naming (tui-button, is-size-*, is-theme-*, is-style-*),
 * this branch must be updated to match. There is no automated check for drift.
 * Consider removing changeTag="span" support when legacy callers are migrated.
 */
```

## 5. Delete dead `Button.jsx` if it exists

**Problem:** If a pre-TUI `Button.jsx` still exists alongside `Button.tsx`, it's dead code.

**Discovery:** `Button.jsx` does NOT exist — only `Button.tsx` and `LegacyButton.tsx`. **Skip this item.**

## 6. Add dev warning when `onChange` is passed

**Problem:** Line 138 destructures `onChange: _onChange` and silently discards it. Callers may think their onChange is working.

**Fix:** Add a dev warning (using the `useRef` guard pattern from item 1):
```tsx
const hasWarnedOnChange = useRef(false)

useEffect(() => {
  if (!hasWarnedOnChange.current && isDev() && props.onChange !== undefined) {
    console.warn(
      '[Fields Button] `onChange` prop is not supported on Button and will be ignored. ' +
      'Use `onClick` for click handling.'
    )
    hasWarnedOnChange.current = true
  }
}, [])
```
