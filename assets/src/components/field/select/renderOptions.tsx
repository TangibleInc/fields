import type { ReactNode } from 'react'

type Option = { value: string | number; label: string; choices?: Option[] }
type Parts = { Option: any; Group: any; Label: any }

/**
 * Render static select options for TUI Select or MultiSelect — same shape,
 * different compound parts. Handles flat and grouped choices and per-option
 * disabling. (No loading/empty states — select choices are always static.)
 */
export function renderSelectOptions(
  options: Option[],
  { disabledKeys = [], parts }: { disabledKeys?: (string | number)[]; parts: Parts }
): ReactNode {
  const { Option, Group, Label } = parts
  const isDisabled = (value: string | number) => disabledKeys.map(String).includes(String(value))

  const flat = options.filter((o) => !o.choices)
  const groups = options.filter((o) => o.choices)

  return (
    <>
      {flat.map((o) => (
        <Option key={o.value} value={o.value} disabled={isDisabled(o.value)}>
          {o.label}
        </Option>
      ))}
      {groups.map((g) => (
        <Group key={g.value}>
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
