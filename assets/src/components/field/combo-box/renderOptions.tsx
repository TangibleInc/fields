import type { ReactNode } from 'react'
import type { ComboboxOption } from './useComboboxData'

type Parts = {
  Option: any
  Group: any
  Label: any
}

/**
 * Render the option list for either TUI Combobox or MultiCombobox — same shape,
 * different compound parts. Handles loading and empty ("No results") states as
 * disabled options, flat and grouped choices, and per-option disabling.
 */
export function renderComboOptions(
  options: ComboboxOption[],
  {
    loading,
    disabledKeys = [],
    parts,
  }: { loading?: boolean; disabledKeys?: (string | number)[]; parts: Parts }
): ReactNode {
  const { Option, Group, Label } = parts

  if (loading) {
    return (
      <Option value="_loading" disabled>
        Loading…
      </Option>
    )
  }

  const isDisabled = (value: string | number) => disabledKeys.map(String).includes(String(value))

  const flat = options.filter((o) => !o.choices)
  const groups = options.filter((o) => o.choices)

  if (flat.length === 0 && groups.length === 0) {
    return (
      <Option value="_noResults" disabled>
        No results
      </Option>
    )
  }

  return (
    <>
      {flat.map((o) => (
        <Option key={o.value} value={o.value} disabled={isDisabled(o.value)}>
          {o.label}
        </Option>
      ))}
      {groups.map((g) => (
        <Group key={g.key}>
          <Label>{g.label}</Label>
          {(g.choices ?? []).map((o) => (
            <Option key={o.value} value={o.value} disabled={isDisabled(o.value)}>
              {o.label}
            </Option>
          ))}
        </Group>
      ))}
    </>
  )
}

/** Flatten grouped options to a single { value, label } list. */
export function flatten(options: ComboboxOption[]): ComboboxOption[] {
  return options.flatMap((o) => (o.choices ? o.choices : [o]))
}
