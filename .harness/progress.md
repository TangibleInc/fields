# Fields TUI Migration — Batch 2 Progress Log

## Iteration 11 — 2026-03-05T23:44:19Z
Task: Add/update Jest tests for migrated components
Result: pass
Files changed: tests/jest/cases/components/controls/Checkbox.test.tsx, tests/jest/cases/components/controls/Switch.test.tsx, tests/jest/cases/components/controls/Radio.test.tsx, tests/jest/cases/components/controls/Textarea.test.tsx, tests/jest/cases/components/elements/Notice.test.tsx
Commit: bb14a51
Notes: Checkbox/Switch/RadioGroup tested via direct component import (avoids Control.tsx mount-fire). Textarea tested via fields.render (direct import fails: TextArea.tsx → ../../base → Modal.tsx → undefined getter in base/index.ts). Textarea onChange-on-mount not tested due to Control.tsx wrapper bug. Notice direct import works fine. 23/37 suites passing (4 new suites; all pre-existing failures unchanged). All tasks complete.

## Iteration 10 — 2026-03-05T23:40:07Z
Task: Migrate Notice to TUI
Result: pass
Files changed: assets/src/components/base/notice/Notice.tsx
Commit: 2b2ed5a
Notes: TUI Notice uses Notice.Body (not Notice.Content as spec predicted). NoticeHandle not re-exported from @tangible/ui root — used forwardRef<HTMLElement> with `as never` cast to avoid TS error. type→theme mapping: error→danger, others unchanged. dismissible set from !!onDismiss. Added className="tf-notice" for legacy CSS compat. 19/33 suites passing (baseline preserved). Task 11 (Jest tests for all migrated components) remains.

## Iteration 9 — 2026-03-05T23:38:59Z
Task: Migrate Textarea — fix onChange mount-fire
Result: pass
Files changed: assets/src/components/field/textarea/TextArea.tsx
Commit: 3ef837e
Notes: Added mountedRef guard to DynamicTextarea — same pattern as DynamicTextField in Text.tsx. useTextField removal from main component was already complete from Task 8. 19/33 suites passing (baseline preserved). Tasks 10 and 11 remain.

## Iteration 8 — 2026-03-05T23:36:06Z
Task: Migrate Textarea to TUI — types + forwardRef + extract DynamicTextarea
Result: pass
Files changed: assets/src/components/field/textarea/TextArea.tsx
Commit: 54ab8f8
Notes: TUI Textarea extends TextareaHTMLAttributes so data-identifier passes through naturally. TUI path calls props.onChange(event.target.value) directly in onChange handler — no useState/useEffect needed (no mount-fire bug in this path). DynamicTextarea retains useState + useEffect without mountedRef guard; Task 9 will add that guard. 19/33 suites passing (baseline preserved).

## Iteration 7 — 2026-03-05T23:34:45Z
Task: Migrate RadioGroup — fix onChange mount-fire
Result: pass
Files changed: none
Commit: none (no code change required)
Notes: TUI onValueChange is interaction-only — the onChange-on-mount bug was already eliminated when react-aria was replaced in task 5. mountedRef guard is a no-op, same outcome as Checkbox task 2 and Switch task 4. 19/33 suites passing (baseline preserved).

## Iteration 6 — 2026-03-05T23:32:32Z
Task: Migrate Radio to TUI — types + TUI component
Result: pass
Files changed: assets/src/components/field/radio/Radio.tsx, assets/src/components/field/radio/RadioGroup.tsx
Commit: 0f7be93
Notes: TUI Radio uses `label` prop (not `children`) — children is mapped to label. TUI Radio forwards to HTMLButtonElement (not <input> as spec says). RadioContext stub removed from RadioGroup — was only imported by Radio.tsx. Added `id` to FieldsRadioProps for AlignmentMatrix.tsx compat (AlignmentMatrix passes id to <Radio> — accepted in interface but not forwarded to TUI since TUI Radio doesn't accept it). ButtonOption.tsx has a pre-existing TS error (useRadio state type mismatch) unrelated to this migration. 19/33 suites passing (baseline preserved).

## Iteration 5 — 2026-03-05T23:29:01Z
Task: Migrate RadioGroup to TUI — types + TUI component
Result: pass
Files changed: assets/src/components/field/radio/RadioGroup.tsx
Commit: ae3321f
Notes: TUI RadioGroup has no forwardRef — ref forwarded to outer wrapper div instead. RadioContext kept as createContext(null) stub so Radio.tsx doesn't have an import error (Task 6 will remove it). TUI Radio actually forwards to HTMLButtonElement (not <input> as spec says) — correct this in Task 6. onChange-on-mount bug in RadioGroup is naturally fixed by TUI migration (onValueChange fires only on user interaction). 19/33 suites passing (baseline preserved).

## Iteration 4 — 2026-03-05T23:26:52Z
Task: Migrate Switch — fix onChange mount-fire + controlled value
Result: pass
Files changed: assets/src/components/field/switch/Switch.tsx
Commit: 7f6b8ca
Notes: Same controlled pattern as Checkbox task 2. Removed useState + useEffect entirely. boolValue derived directly from value prop. mountedRef guard is unnecessary — TUI onCheckedChange fires only on user interaction. 19/33 suites passing (baseline preserved). Note: run jest with `--config tests/jest/jest.config.js` not bare `npx jest`.


*Batch 1 (Button + Text fixes) complete. See git history for previous progress.*

## Iteration 3 — 2026-03-05T23:11:52Z
Task: Migrate Switch to TUI — types + forwardRef + TUI component
Result: pass
Files changed: assets/src/components/field/switch/Switch.tsx, tests/jest/cases/components/controls/FieldGroup.test.tsx
Commit: 62f933e
Notes: SwitchField (index.tsx) is the registered type; Switch.tsx is the inner component. SwitchField handles 'on'/'off' string conversion — Switch.tsx deals in booleans. FieldGroup.test.tsx updated to use [role="switch"] instead of .tf-switch-label (TUI Switch renders a <button role="switch"> not a <label class="tf-switch-label">). 19/33 suites passing (baseline preserved).

## Iteration 2 — 2026-03-05T23:08:44Z
Task: Migrate Checkbox — fix onChange mount-fire + controlled value
Result: pass
Files changed: assets/src/components/field/checkbox/Checkbox.tsx
Commit: 1fc0a42
Notes: Removed useState + useEffect. boolValue derived directly from value prop; controlled when value is provided, defaultChecked=false otherwise. mountedRef guard is confirmed unnecessary — TUI onCheckedChange is interaction-only. isDev warning omitted — no dangerous pattern remains in the controlled approach. 19/33 suites passing (baseline unchanged).

## Iteration 1 — 2026-03-05T22:58:07Z
Task: Migrate Checkbox to TUI — types + forwardRef + TUI component
Result: pass
Files changed: assets/src/components/field/checkbox/Checkbox.tsx
Commit: 63dbdcf
Notes: isDev() returns false in Jest (import.meta.env.DEV=false via Babel), so a11y label warning is unconditional. TUI Checkbox is always-controlled (checked={localState}) with value→state sync via useEffect (no onChange call) to preserve repeater bulk-select. The onChange-on-mount bug is naturally fixed — TUI onCheckedChange only fires on user interaction. Task 2 item 3 (mountedRef guard) may be a no-op for TUI path; verify before adding.

## Iteration 1 — 2026-03-05T22:55:55Z
Task: Generate implementation plan
Result: pass
Notes: Refined existing plan with 11 tasks from 5 spec files (migrate-checkbox, migrate-switch, migrate-radio, migrate-textarea, migrate-notice) + wrapper-contract. Plan covers Checkbox, Switch, RadioGroup/Radio, Textarea, Notice migrations to TUI, all sharing the onChange-on-mount bug fix pattern.

## Iteration 0 — 2026-03-05
Task: Generate batch 2 plan and specs
Result: pass
Notes: 5 component migrations (Checkbox, Switch, Radio, Textarea, Notice) across 11 tasks. All have onChange-on-mount bug. Specs written from actual source review. Jest infra fixed in batch 1 (19/33 suites passing). TUI v0.0.4 installed.

**Stashed dirty state from iteration 1:** harness-iteration-1-dirty

**Stashed dirty state from iteration 2:** harness-iteration-2-dirty

**Stashed dirty state from iteration 3:** harness-iteration-3-dirty
