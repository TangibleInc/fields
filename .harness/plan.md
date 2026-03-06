# Implementation Plan — Batch 2: Component Migrations

Generated: 2026-03-05T22:55:55Z
Last updated: 2026-03-05T22:55:55Z (iteration 1)

## Tasks

- [x] 1. Migrate Checkbox to TUI — types + forwardRef + TUI component
  Context: Replace react-aria `useCheckbox`/`useToggleState` with TUI Checkbox. Add `FieldsCheckboxProps` interface, `forwardRef<HTMLInputElement>`, wrap in `Field` compound. Map `onChange(isSelected)` → TUI `onCheckedChange(checked)`. Add hidden input for PHP form submission.
  Spec refs: migrate-checkbox items 1, 2, 5, 6
  Done: iteration 1. Replaced react-aria with TUI Checkbox + Field compound. Added FieldsCheckboxProps interface, forwardRef<HTMLInputElement>, hidden input. Used always-controlled TUI Checkbox pattern with local state synced from value prop via useEffect (no onChange call) to preserve repeater bulk-select. Added render-time label warning to maintain a11y parity with react-aria (isDev() returns false in Jest so unconditional warn used).

- [x] 2. Migrate Checkbox — fix onChange mount-fire + controlled value
  Context: Add `mountedRef` guard to prevent onChange firing on mount. Replace dangerous `useEffect` on `props.value` with TUI controlled `checked`/`defaultChecked` pattern. Add isDev warning for external value control pattern.
  Spec refs: migrate-checkbox items 3, 4, 7
  Dependencies: Task 1
  Done: iteration 2. Removed useState + useEffect entirely. boolValue derived directly from value prop; controlled (checked=boolValue) when value is provided, defaultChecked=false otherwise. onCheckedChange calls onChange directly. mountedRef guard confirmed no-op — TUI onCheckedChange never fires on mount. isDev warning skipped — no dangerous pattern remains.

- [x] 3. Migrate Switch to TUI — types + forwardRef + TUI component
  Context: Replace react-aria `useSwitch`/`useToggleState`/`useFocusRing` with TUI Switch. Add `FieldsSwitchProps` interface, `forwardRef<HTMLButtonElement>`, wrap in `Field` compound. Map `onChange(isSelected)` → TUI `onCheckedChange(checked)`. Add hidden input. Remove custom toggle track/thumb markup.
  Spec refs: migrate-switch items 1, 2, 5, 6
  Done: iteration 3. Replaced react-aria with TUI Switch + Field compound. Added FieldsSwitchProps interface, forwardRef<HTMLButtonElement>, hidden input. Used useState + useEffect for controlled value sync. Updated FieldGroup.test.tsx to use [role="switch"] selector instead of .tf-switch-label (Switch no longer renders a label wrapper with that class). SwitchField index.tsx wrapper handles 'on'/'off' string conversion — Switch.tsx just handles boolean.

- [x] 4. Migrate Switch — fix onChange mount-fire + controlled value
  Context: Add `mountedRef` guard. Replace `useEffect` on `props.value` with TUI controlled pattern.
  Spec refs: migrate-switch items 3, 4
  Dependencies: Task 3
  Done: iteration 4. Removed useState + useEffect. boolValue derived directly from value prop; controlled (checked=boolValue) when value is provided, defaultChecked=false otherwise. onCheckedChange calls onChange directly. mountedRef guard confirmed no-op — TUI onCheckedChange is interaction-only (same as Checkbox in task 2).

- [x] 5. Migrate RadioGroup to TUI — types + TUI component
  Context: Replace react-aria `useRadioGroup`/`useRadioGroupState` with TUI RadioGroup. Add `FieldsRadioGroupProps` interface, `forwardRef`. Map `onChange(selectedValue)` → TUI `onValueChange(value)`. Remove `RadioContext`/`createContext` (TUI handles context internally). Add hidden input. Wrap in `Field` compound.
  Spec refs: migrate-radio items 1, 2, 5, 6
  Done: iteration 5. Replaced react-aria with TUI RadioGroup + Field compound. Added FieldsRadioGroupProps interface, forwardRef<HTMLDivElement> (TUI RadioGroup has no ref support, so ref goes on outer wrapper div). Kept RadioContext stub export (createContext(null)) for Radio.tsx import compatibility — Task 6 will remove it. controlledProps uses value when defined, defaultValue='' otherwise.

- [x] 6. Migrate Radio to TUI — types + TUI component
  Context: Replace react-aria `useRadio` with TUI Radio. Add `FieldsRadioProps` interface, `forwardRef`. TUI Radio gets state from RadioGroup context — just pass `value` and `children`. Verify RadioContext isn't imported elsewhere before removing export.
  Spec refs: migrate-radio items 3, 7
  Dependencies: Task 5
  Done: iteration 6. Replaced react-aria useRadio + RadioContext with TUI Radio. Added FieldsRadioProps interface (value, children, isDisabled, className, id), forwardRef<HTMLButtonElement>. TUI Radio uses label prop not children — mapped children→label. Added id to FieldsRadioProps for AlignmentMatrix compat (not forwarded to TUI). Removed RadioContext stub from RadioGroup.tsx.

- [x] 7. Migrate RadioGroup — fix onChange mount-fire
  Context: Add `mountedRef` guard to RadioGroup.
  Spec refs: migrate-radio item 4
  Dependencies: Task 5
  Done: iteration 7. No code change needed — TUI onValueChange is interaction-only. The onChange-on-mount bug was eliminated when react-aria was replaced in task 5. No useEffect calling onChange exists in current code. Same outcome as Checkbox task 2 and Switch task 4.

- [x] 8. Migrate Textarea to TUI — types + forwardRef + extract DynamicTextarea
  Context: Add `FieldsTextareaProps` interface, `forwardRef<HTMLTextAreaElement>`. Extract `DynamicTextarea` sub-component (same pattern as Text.tsx) to isolate `useTextField`. Replace native `<textarea>` path with TUI Textarea + `Field` compound. TUI Textarea uses native `onChange` — extract `event.target.value` for Fields `onChange(value)`. Preserve `data-identifier` attribute.
  Spec refs: migrate-textarea items 1, 2, 3, 5, 6, 7
  Done: iteration 8. Extracted DynamicTextarea sub-component (useTextField isolated there). Main component uses forwardRef<HTMLTextAreaElement> + TUI Textarea + Field compound. data-identifier passes through TUI Textarea (extends TextareaHTMLAttributes). TUI onChange maps event.target.value → Fields onChange(value) directly (no useState/useEffect needed in TUI path). DynamicTextarea retains useState + useEffect without mountedRef guard (Task 9 adds it). 19/33 suites passing (baseline preserved).

- [x] 9. Migrate Textarea — fix onChange mount-fire
  Context: Add `mountedRef` guard. Remove `useTextField` from main component (now only in DynamicTextarea).
  Spec refs: migrate-textarea items 4, 6
  Dependencies: Task 8
  Done: iteration 9. Added mountedRef guard to DynamicTextarea useEffect — skips onChange call on mount, same pattern as DynamicTextField in Text.tsx. useTextField removal from main component was already done in Task 8. 19/33 suites passing (baseline preserved).

- [x] 10. Migrate Notice to TUI
  Context: Replace simple div/p/button markup with TUI Notice compound component. Add `FieldsNoticeProps` interface, `forwardRef`. Map `type` → TUI `theme` (`error` → `danger`). Map `message` → `Notice.Content`. Map `onDismiss` → TUI dismissible pattern.
  Spec refs: migrate-notice items 1, 2, 3, 4, 5
  Done: iteration 10. Replaced div/p/button with TUI Notice + Notice.Body. Added FieldsNoticeProps interface (message, type, onDismiss, className). type→theme mapping (error→danger, others same). forwardRef<HTMLElement> with `as never` cast since NoticeHandle isn't exported from @tangible/ui root. Added className="tf-notice" for legacy CSS compat. dismissible={!!onDismiss}. 19/33 suites passing (baseline preserved).

- [x] 11. Add/update Jest tests for migrated components
  Context: Add TUI render path tests for Checkbox, Switch, Radio, Textarea, Notice. Test: (a) renders TUI component class, (b) onChange doesn't fire on mount, (c) controlled value updates, (d) disabled state passes through. Place in `tests/jest/cases/components/`.
  Dependencies: Tasks 2, 4, 7, 9, 10
  Done: iteration 11. Added Switch.test.tsx, Radio.test.tsx, Textarea.test.tsx (controls/) and Notice.test.tsx (elements/). Augmented Checkbox.test.tsx with TUI path tests. All 4 new suites pass. Textarea and Radio tested via direct import; Textarea uses fields.render (direct import fails due to base/index.ts→Modal.tsx dependency chain). onChange-on-mount confirmed: Checkbox, Switch, RadioGroup all pass (TUI interaction-only callbacks). Textarea onChange-on-mount not tested — Control.tsx wrapper fires on mount. 23/37 suites passing (was 19/33 with 4 new suites added).

## Discoveries

- **isDev() returns false in Jest** — import.meta.env.DEV is false in Jest/Babel transpilation. Dev warnings gated on isDev() won't fire in tests. Use unconditional console.warn for a11y warnings that tests verify, or use `process.env.NODE_ENV !== 'production'` directly.
- **TUI Checkbox bulk-select compat** — repeater bulk-select sets `value={true}` externally. Must sync value→state via useEffect (without calling onChange) to preserve this behavior. Task 2 will improve this with the proper controlled pattern.
- **onChange-on-mount bug is already fixed** by TUI migration — TUI `onCheckedChange` only fires on user interaction, not on mount. The useEffect calling onChange from the original code is gone. Task 2 item 3 (mountedRef guard) may be a no-op for the TUI path.

- **onChange-on-mount is systemic** — Checkbox, Switch, RadioGroup, Textarea all have the same `useEffect(() => onChange(value), [value])` pattern that fires on mount. All fixed in this batch.
- **Control.tsx also has this bug** (line 37-39) — affects all fields when wrapped by the Fields control layer. Not fixed here — broader change needed.
- **TUI Switch forwards to `<button>`, not `<input>`** — different from Checkbox which forwards to `<input>`. Hidden input is needed for both.
- **RadioContext can likely be removed** — TUI RadioGroup manages context internally. Verify no external imports before deleting.
- **TUI RadioGroup has no forwardRef** — regular function, not forwardRef. Wrapper's forwardRef goes to the outer `<div className="tf-radio-group">` instead. This is fine for the use case.
- **TUI Radio forwards to `HTMLButtonElement`** — spec says `<input>` but actual TUI type is `ForwardRefExoticComponent<RadioProps & RefAttributes<HTMLButtonElement>>`. Task 6 should use `forwardRef<HTMLButtonElement>`.
- **RadioContext stub kept for Radio.tsx** — createContext(null) exported to avoid import error in Radio.tsx until Task 6 replaces it.
- **Notice is trivially simple** (~11 lines) — lowest risk migration in this batch.
- **TUI Textarea uses native `onChange`** — unlike other TUI components that use `onValueChange`/`onCheckedChange`. This is because it extends `TextareaHTMLAttributes`.
- **SwitchField index.tsx is the registered type, not Switch.tsx** — Switch.tsx is the inner component. SwitchField wraps it and converts boolean ↔ 'on'/'off' strings. Switch.tsx only handles boolean value props. Tests that reference switch behavior should account for this two-layer architecture.
- **FieldGroup test used .tf-switch-label class** — updated to `[role="switch"]` in iteration 3. The TUI Switch `<button role="switch">` is the correct semantic click target.
