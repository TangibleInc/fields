# Build Iteration {{ITERATION}}
You are executing a single iteration of a supervised development loop, fixing and improving Fields→TUI component wrappers in the Tangible Fields plugin.

**Timestamp:** {{TIMESTAMP}}
**Project root:** {{PROJECT_ROOT}}

## Before you start
Run `git status`. If there are uncommitted changes you did not make, do **NOT** proceed. Append a note to `.harness/progress.md` with `Result: blocked — dirty working tree` and exit immediately.

## Your job
1. Read `.harness/plan.md`. Find the **first task** marked `- [ ]` that is **not** marked `Blocked:`.
2. Read the **last 3 entries** in `.harness/progress.md` to understand what previous iterations did and any gotchas they noted.
3. Do that task. **Only one task.**
4. Run validation:
      **If it fails**, fix it or note it as blocked.
      **If it passes**, commit, then update `plan.md` and append to `progress.md`.
5. Record: If ALL tasks in `plan.md` are `[x]`, write the file `.harness/COMPLETE`.

## Validation commands
Run these after completing your work. **All must pass** before you commit.

{{VALIDATION_COMMANDS}}

If a command fails:
- Make **up to 2 attempts** to fix the issue.
- If you cannot fix it, do NOT commit. Mark the task in `plan.md` with `Blocked:` and the reason. Log the failure in `progress.md`.

---

## Project context

{{PROJECT_CONTEXT}}

---

## Wrapper contract guidance

You are fixing and improving Fields→TUI component wrappers. These wrappers bridge the legacy Fields API to modern TUI (@tangible/ui) components. Read `.harness/specs/wrapper-contract.md` for the canonical pattern.

### Key principles

1. **Props mapping**: Fields uses `onChange`; TUI uses `onValueChange`/`onCheckedChange`/`onOpenChange`. The wrapper translates.
2. **Field compound slots**: All field-type wrappers should use `Field > Field.Label + Field.Control + Field.HelperText` from TUI.
3. **Dev warnings**: Use `useRef` guard to fire once per instance on mount, not per render. Use shared `isDev()` utility from `assets/src/utils/is-dev.ts`.
4. **No TUI internal access**: Never `querySelector` into TUI component DOM. Use forwarded refs. TUI components forward refs to their root or primary element.
5. **Hidden inputs**: Preserve `<input type="hidden" name={name} value={value} />` for PHP form submission when the TUI component doesn't render a native input.
6. **forwardRef**: All wrappers must use `forwardRef` with typed refs matching the TUI component's forwarded element.
7. **TypeScript**: Define `Fields{Component}Props` interface. Destructure known Fields-specific props, spread remaining to TUI.

### TUI component ref contracts (read-only reference)
- `Button` → forwards to `<button>` or `<a>` depending on `href`
- `TextInput` → forwards to the `<input>` element directly

### Legacy fallback pattern
When a Fields prop combination doesn't map to TUI (e.g., unmapped Button layouts), fall back to the legacy component with an early return. Gate on the specific condition, not a generic try/catch.

---

## After completing the task
### If validation passes:

1. **Stage and commit** your changes with a clear, conventional commit message. Never stage files unrelated to your task. Use the format:
   ```
   fix(ComponentName): brief description of fix

   Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
   ```

2. **Update `.harness/plan.md`:**
   - Change `- [ ]` to `- [x]` for the completed task.
   - Add `Done: iteration {{ITERATION}}.` followed by a brief note about what you did.
   - If you discovered something relevant to other tasks, add it to the `## Discoveries` section.
3. **Append to `.harness/progress.md`** in this exact format:

```
## Iteration {{ITERATION}} — {{TIMESTAMP}}
Task: [task description from plan]
Result: pass
Files changed: [list of files]
Commit: [short hash]
Notes: [anything the next iteration should know]
```

### If validation fails and you cannot fix it:

1. Do NOT commit.
2. Revert your changes: `git checkout -- . ':!.harness/'` (this preserves harness state files). Clean up any new files you created with `git clean -fd --exclude=.harness/`.
3. Mark the task as blocked in `.harness/plan.md`:
   `- [ ] N. Task description`
   `  Blocked: [reason]`
4. Append to `.harness/progress.md`:

```
## Iteration {{ITERATION}} — {{TIMESTAMP}}
Task: [task description from plan]
Result: fail
Reason: [what went wrong]
Notes: [what the next iteration or a human should know]
```

## Completion check

After updating `plan.md`, check: are ALL tasks marked `[x]`?

- If **no**: Do NOT create `.harness/COMPLETE`. Even if you think remaining tasks are unnecessary, leave them for the operator to decide.
- If **yes**: Create the file `.harness/COMPLETE` containing the text `All tasks complete.`

---

## Rules

- **One task.** Never start a second task.
- **Do not modify files outside the scope of your task** unless required for validation to pass.
- **Do not refactor, optimise, or "improve" code** beyond what the task requires.
- **Do not modify `.harness.yml`.**
- **Commit messages** should be conventional commits (e.g., `fix:`, `feat:`, `refactor:`).
- **Do not guess at intent.** If you don't have enough information to proceed, note it in the Discoveries section of `plan.md` rather than guessing.
- **Read the actual component code** before making changes. Spec files reference line numbers that may have shifted.
