# Implementation Plan

Generated: 2026-03-05
Last updated: 2026-03-05T19:49:37Z (iteration 1)

## Tasks

- [x] 1. Create shared `isDev()` utility at `assets/src/utils/is-dev.ts`
  Context: Shared utility for dev-only warnings. Pattern: `export const isDev = (): boolean => ...` checking `import.meta.env?.DEV` or `process.env.NODE_ENV !== 'production'`. See `.harness/specs/wrapper-contract.md` for usage pattern.
  Spec refs: wrapper-contract (dev warnings section)
  Done: iteration 1. Created `assets/src/utils/is-dev.ts`. Used `unknown` cast to avoid ImportMeta type mismatch — tsconfig has no vite/import.meta types defined.

- [x] 2. Fix Button.tsx — warning guards + isDev import
  Context: Replace module-level `let hasWarnedAbout*` flags with `useRef` guards inside the component. Replace hand-rolled `isDevBuild` const with `isDev()` import. Add dev warning when `onChange` prop is passed (currently silently destructured to `_onChange`).
  Spec refs: fix-button items 1, 2, 6
  Dependencies: Task 1
  Done: iteration 2. Added useRef/useEffect imports, isDev import. Removed module-level let flags and isDevBuild const. Added hasWarnedSpan, hasWarnedMissingLabel, hasWarnedOnChange useRef guards. All refs placed before early return to satisfy rules of hooks. typecheck and jest failures are pre-existing (no new errors introduced).

- [x] 3. Fix Button.tsx — destructive normalisation + span branch docs + delete dead .jsx
  Context: Move `destructive → danger` theme normalisation before the `changeTag === 'span'` branch split (currently line 202 only normalises inside span branch, but the TUI path at line 253 passes `resolvedTheme` which could be `'destructive'`). Add fragility comment to span branch explaining it manually replicates TUI classes. Delete `Button.jsx` if it exists (superseded by `.tsx`).
  Spec refs: fix-button items 3, 4, 5
  Done: iteration 3. Split `resolvedTheme` into `rawTheme`+normalised `resolvedTheme` (destructive→danger) before branch split. Removed duplicate `themeClass` const in span branch; span now uses `resolvedTheme` directly. Replaced brief inline comment with `@fragile` JSDoc block. Button.jsx deletion skipped (doesn't exist).

- [x] 4. Fix Text.tsx — TypeScript annotations (`FieldsTextProps` interface)
  Context: `TextField` component is untyped (`props => {`). Add `FieldsTextProps` interface covering all used props: `dynamic`, `inputMask`, `prefix`, `suffix`, `value`, `onChange`, `name`, `placeholder`, `readOnly`, `isDisabled`, `isRequired`, `isInvalid`, `error`, `label`, `labelVisuallyHidden`, `description`, `descriptionVisuallyHidden`, `className`, `inputClassName`, `size`, `type`. Type the component signature.
  Spec refs: fix-text item 1
  Done: iteration 4. Added `FieldsTextProps` interface; imported `SizeStandard`/`TextInputType` from `@tangible/ui` for accurate types. Typed `useRef` as `HTMLInputElement | null`. Cast `useTextField` args as `any` (to be cleaned up in task 6). No new typecheck errors introduced.

- [x] 5. Fix Text.tsx — onChange mount-fire bug (mountedRef guard)
  Context: `useEffect(() => { if (props.onChange) props.onChange(value) }, [value])` fires on mount, sending the initial value to the store immediately. Add a `mountedRef` guard: skip the first invocation, only fire onChange on subsequent value changes.
  Spec refs: fix-text item 2
  Dependencies: Task 4
  Done: iteration 5. Added `mountedRef = useRef(false)`; effect sets it true on first run and returns early, so onChange only fires on subsequent value changes.

- [x] 6. Fix Text.tsx — remove useTextField from TUI path + add forwardRef
  Context: `useTextField(props, ref)` is called unconditionally but its return values (`labelProps`, `inputProps`, `descriptionProps`) are only used in the dynamic path. Move the call inside the `if (hasDynamic)` block. Add `forwardRef<HTMLInputElement>` to the component — TUI TextInput forwards its ref to the `<input>` element.
  Spec refs: fix-text items 3, 4
  Dependencies: Task 4
  Done: iteration 6. Extracted `DynamicTextField` internal sub-component that owns `useTextField`, its own state, and the dynamic render path. Main `TextField` wrapped with `forwardRef<HTMLInputElement>`; forwarded ref passed to `TuiTextInput` via callback ref (also handles inputMaskRef). querySelector in ref callback preserved for task 7.

- [x] 7. Fix Text.tsx — remove querySelector, fix inputMaskRef via TUI ref
  Context: Line 113 uses `node.querySelector?.('input') ?? node` to get the input element for masking. TUI TextInput ref IS the `<input>` element, so `querySelector` is unnecessary. Simplify: `inputMaskRef.current = node`. Add comment explaining `Field.HelperText` className approach (using `tui-visually-hidden` class because Field.HelperText doesn't expose a `hidden` prop).
  Spec refs: fix-text items 5, 6
  Dependencies: Task 6
  Done: iteration 7. Removed querySelector from inputMaskRef callback (TUI TextInput forwards ref to <input> directly). Added explanatory comment on Field.HelperText tui-visually-hidden workaround.

- [x] 8. Add/update Jest tests for TUI render paths (Button mapped layouts, Text non-dynamic)
  Context: Existing tests only cover legacy Button path and dynamic Text path. Add tests for: (a) Button with mapped layout (e.g., `layout="primary"`) renders TUI Button, (b) Button with unmapped layout falls back to LegacyButton, (c) Text without `dynamic` prop renders TUI TextInput, (d) Text onChange doesn't fire on mount. Place in `tests/jest/cases/components/`.
  Spec refs: quality gate
  Dependencies: Tasks 2, 3, 5, 6, 7
  Done: iteration 8. Added 2 Button tests (mapped layout → tui-button class, unmapped → LegacyButton tf-button-* class) and 2 Text tests (.tf-text-tui render path, onChange not fired on mount). No validation commands in harness — 33 pre-existing Jest failures remain unchanged.

## Discoveries

- **Control.tsx has the same onChange-on-mount bug** as Text.tsx (useEffect fires on mount). Systemic issue affecting all fields. Don't fix here — broader change needed.
- **`strict: false` in tsconfig** — typecheck catches errors but won't enforce strict nulls. Good enough for migration phase.
- **Text tests only cover dynamic/CodeMirror path** — no existing coverage for the TUI TextInput render path.
- **Button tests only cover legacy path** — mapped layouts that go through TUI have no test coverage.
- **Button.jsx does NOT exist** — only Button.tsx and LegacyButton.tsx. Task 3 can skip the deletion step.
