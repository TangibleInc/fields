import { useRef } from 'react'

import { getConfig } from '../../../index.tsx'
import Control from '../../../Control'
import { EnsureControlContext } from './ensure-context'

export interface DynamicValueSettingsProps {
  /** The dynamic value whose declared `fields` to render. */
  valueName: string
  /** Current settings, keyed by setting name. */
  settings: Record<string, any>
  /** Called with the full next settings object on every change. */
  onChange: (settings: Record<string, any>) => void
  className?: string
}

/**
 * The settings sub-form of a dynamic value: one Control per field the value
 * declares in PHP, with conditions between them resolved against the
 * settings themselves. Extracted from DynamicFieldSettings so a consumer
 * embedding the picker in its own dialog can render just this part.
 *
 * Renders nothing for a value without settings.
 */
const DynamicValueSettings = ({
  valueName,
  settings,
  onChange,
  className = '',
}: DynamicValueSettingsProps) => {
  const { dynamics } = getConfig()
  const fields = dynamics?.values?.[valueName]?.fields

  // Conditions read sibling settings through data.getValue at evaluation
  // time, so they must see the latest settings, not the render's closure.
  const settingsRef = useRef(settings)
  settingsRef.current = settings

  if (!Array.isArray(fields) || fields.length === 0) return null

  const update = (name: string, value: any) => {
    const next = { ...settingsRef.current, [name]: value }
    settingsRef.current = next
    onChange(next)
  }

  return (
    <EnsureControlContext>
      <div className={`tf-dynamic-settings__fields ${className}`.trim()}>
        {fields.map(field => (
          <div key={field.name} className="tf-dynamic-settings__field">
            <Control
              {...field}
              value={settings[field.name] ?? ''}
              onChange={value => update(field.name, value)}
              visibility={{
                condition: field.condition?.condition ?? false,
                action: field.condition?.action ?? 'show',
              }}
              data={{
                getValue: (name: string) => settingsRef.current[name] ?? '',
              }}
            />
          </div>
        ))}
      </div>
    </EnsureControlContext>
  )
}

export default DynamicValueSettings
