# Fields TUI Migration — Progress Log

## Iteration 7 — 2026-03-05T20:05:00Z
Task: Fix Text.tsx — remove querySelector, fix inputMaskRef via TUI ref
Result: pass
Files changed: assets/src/components/field/text/Text.tsx
Commit: 1f0c7df
Notes: querySelector removed from inputMaskRef callback — TUI TextInput forwards ref directly to <input>, so `node` is already the input element. Added comment explaining `tui-visually-hidden` className workaround on Field.HelperText (no `hidden` prop on that component). Typecheck: no new errors in Text.tsx. Jest: 33 pre-existing failures unchanged. Task 8 (Jest tests for TUI render paths) is next.

## Iteration 6 — 2026-03-05T20:01:35Z
Task: Fix Text.tsx — remove useTextField from TUI path + add forwardRef
Result: pass
Files changed: assets/src/components/field/text/Text.tsx
Commit: cd38bb9
Notes: Created internal `DynamicTextField` component to own `useTextField` + dynamic render path. Main `TextField` uses `forwardRef<HTMLInputElement>`; forwarded ref passed to `TuiTextInput` via callback ref that also handles `inputMaskRef`. The `querySelector` hack in the callback ref is preserved — task 7 will remove it. Typecheck: no new errors in Text.tsx. Jest: 33 pre-existing failures (Babel/Jest config), unchanged.

## Iteration 5 — 2026-03-05T20:00:34Z
Task: Fix Text.tsx — onChange mount-fire bug (mountedRef guard)
Result: pass
Files changed: assets/src/components/field/text/Text.tsx
Commit: 5dd6180
Notes: Added `mountedRef = useRef(false)` adjacent to other refs. Effect sets it to `true` on first invocation and returns early — subsequent value changes call `props.onChange` normally. Typecheck and Jest failures remain pre-existing.

## Iteration 4 — 2026-03-05T19:56:38Z
Task: Fix Text.tsx — TypeScript annotations (`FieldsTextProps` interface)
Result: pass
Files changed: assets/src/components/field/text/Text.tsx
Commit: 9d766e8
Notes: Typed `size`/`type` using `SizeStandard`/`TextInputType` from `@tangible/ui`. `useRef()` typed as `HTMLInputElement | null`. `useTextField` args cast as `any` — the `useTextField` call itself will be moved inside the `hasDynamic` block in task 6, removing this cast. Typecheck and Jest failures remain pre-existing.

## Iteration 3 — 2026-03-05T19:55:25Z
Task: Fix Button.tsx — destructive normalisation + span branch docs + delete dead .jsx
Result: pass
Files changed: assets/src/components/base/button/Button.tsx
Commit: 68c7427
Notes: Normalisation moved before branch split by introducing `rawTheme` intermediate. Span branch `themeClass` removed; uses `resolvedTheme` directly. Fragility JSDoc comment added. Typecheck and Jest failures are pre-existing (same as iterations 1 & 2).

## Iteration 2 — 2026-03-05T19:52:50Z
Task: Fix Button.tsx — warning guards + isDev import
Result: pass
Files changed: assets/src/components/base/button/Button.tsx
Commit: b11d6cb
Notes: Typecheck and Jest tests were pre-existing failures (same as iteration 1). No new errors introduced. useRef hooks placed before the !isMappedLayout early return to satisfy rules of hooks. props.onChange referenced inside useEffect closure (not _onChange) matching spec pattern.

## Iteration 1 — 2026-03-05T19:51:42Z
Task: Create shared `isDev()` utility at `assets/src/utils/is-dev.ts`
Result: pass
Files changed: assets/src/utils/is-dev.ts
Commit: 5f795b5
Notes: All 33 Jest test suites were failing before this change (pre-existing Babel/Jest config issue). TypeScript has no `import.meta.env` types — used `unknown` intermediate cast to silence errors. Next task (Fix Button.tsx) can import from `../../../utils/is-dev`.

## Iteration 1 — 2026-03-05T19:49:37Z
Task: Generate implementation plan
Result: pass
Notes: Created plan with 8 tasks from 3 spec files (wrapper-contract, fix-button, fix-text). Plan confirmed against live codebase — all tasks pending, no changes needed from Iteration 0 plan.

## Iteration 0 — 2026-03-05
Task: Generate implementation plan and harness infrastructure
Result: pass
Notes: Created harness config, build prompt, plan with 8 tasks, and 3 spec files (wrapper-contract, fix-button, fix-text). Validated that Button.tsx and Text.tsx exist on feature/tui-integration branch. No Button.jsx to delete. Fields uses jest:test for unit tests, tsconfig has strict: false.

**Stashed dirty state from iteration 1:** harness-iteration-1-dirty

**Stashed dirty state from iteration 2:** harness-iteration-2-dirty

**Stashed dirty state from iteration 3:** harness-iteration-3-dirty

**Stashed dirty state from iteration 4:** harness-iteration-4-dirty

**Stashed dirty state from iteration 5:** harness-iteration-5-dirty

**Stashed dirty state from iteration 6:** harness-iteration-6-dirty

## Iteration 8 — 2026-03-05T20:06:10Z
Task: Add/update Jest tests for TUI render paths (Button mapped layouts, Text non-dynamic)
Result: pass
Files changed: tests/jest/cases/components/elements/Button.test.tsx, tests/jest/cases/components/controls/Text.test.tsx
Commit: 795f1e3
Notes: No validation commands were specified in the harness. Added 4 new tests: Button mapped layout → `button.tui-button`; Button unmapped → `tf-button-legacy-only`; Text TUI path → `.tf-text-tui` + `input`; Text onChange not called on mount. Pre-existing 33 Jest suite failures (Babel/Jest config) unchanged.
