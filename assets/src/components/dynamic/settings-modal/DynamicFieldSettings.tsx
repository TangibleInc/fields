import {
  useState,
  useMemo,
  useEffect,
  useRef,
  useContext,
} from 'react'

import { Modal, SearchSelect, Field, TextInput, Icon } from '@tangible/ui'

import { ControlContext } from '../../../context'
import { getConfig } from '../../../index.tsx'
import { Button } from '../../base'
import { RadioGroup } from '../../field/radio/RadioGroup'
import Radio from '../../field/radio/Radio'
import Control from '../../../Control'

type FieldMode = 'builtin' | 'custom'

interface DynamicFieldSettingsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dynamic: any // DynamicAPI from dynamicValuesAPI()
  editingId?: string
  editingRaw?: string
  /** Mode for fresh opens (no editingRaw) — the insert panel's
      "Custom value…" row opens straight into custom mode. */
  defaultMode?: FieldMode
  onSubmit: (raw: string) => void
}

const DynamicFieldSettings = ({
  open,
  onOpenChange,
  dynamic,
  editingId,
  editingRaw,
  defaultMode = 'builtin',
  onSubmit,
}: DynamicFieldSettingsProps) => {
  if (!dynamic) return null

  const { dynamics } = getConfig()
  const control = useContext(ControlContext)

  /**
   * TUI Modal portals itself, which would land outside the global context
   * class (tf-context-{name}) — recreate the wrapper the react-aria overlay
   * used to provide by giving the Modal a container that carries the
   * context classes (control.wrapper already includes tui-interface).
   *
   * @see renderField() in ./src/index.jsx
   */
  const [modalContainer, setModalContainer] = useState<HTMLElement | null>(null)
  useEffect(() => {
    const host = control?.portalContainer ?? document.body
    const el = document.createElement('div')
    el.className = control?.wrapper ?? 'tui-interface'
    host.appendChild(el)
    setModalContainer(el)
    return () => {
      host.removeChild(el)
    }
  }, [])

  const [mode, setMode] = useState<FieldMode>('builtin')
  const [selectedValue, setSelectedValue] = useState('')
  const [customValue, setCustomValue] = useState('')
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [settingsForm, setSettingsForm] = useState<any[] | null>(null)
  const settingsRef = useRef(settings)
  settingsRef.current = settings

  const isEditing = editingId !== undefined

  // Parse editingRaw into initial state when modal opens
  useEffect(() => {
    if (!open) return

    setSettings({})
    setSettingsForm(null)

    if (editingRaw) {
      const parsed = dynamic.parse(editingRaw)
      if (parsed && parsed.type) {
        // Check if it's a known built-in value
        if (dynamics.values[parsed.type]) {
          setMode('builtin')
          setSelectedValue(parsed.type)
          setCustomValue('')
          // Restore settings from parsed fields
          if (parsed.fields) {
            setSettings(parsed.fields)
          }
          // Check for settings form
          const args = dynamics.values[parsed.type]?.fields
          if (Array.isArray(args) && args.length > 0) {
            setSettingsForm(args)
          }
        } else {
          setMode('custom')
          setCustomValue(editingRaw)
          setSelectedValue('')
        }
      } else {
        setMode('custom')
        setCustomValue(editingRaw)
        setSelectedValue('')
      }
    } else {
      setMode(defaultMode)
      setSelectedValue('')
      setCustomValue('')
    }
  }, [open, editingRaw, defaultMode])

  /**
   * Build grouped choices for the picker from dynamic categories
   */
  const choices = useMemo(() => {
    const allowedTypes = dynamic.getTypes()
    const categoryKeys = dynamic.getCategories()

    const categories = categoryKeys.map(categoryKey => {
      const category = dynamics.categories[categoryKey]
      const categoryChoices = Object.keys(dynamics.values)
        .filter(
          value =>
            category.values.includes(value) &&
            allowedTypes.includes(dynamics.values[value]?.type)
        )
        .reduce(
          (choices, key) => ({
            ...choices,
            [key]: dynamics.values[key].label ?? key,
          }),
          {}
        )

      return {
        name: category.label,
        choices: categoryChoices,
      }
    })

    return categories.filter(
      category => Object.keys(category.choices).length !== 0
    )
  }, [])

  const handleBuiltinSelect = (valueName: string) => {
    if (!valueName) return
    setSelectedValue(valueName)

    const args = dynamics.values[valueName]?.fields
    if (Array.isArray(args) && args.length > 0) {
      setSettingsForm(args)
    } else {
      setSettingsForm(null)
    }
  }

  const updateSettings = (name: string, settingValue: any) => {
    setSettings(prev => {
      const next = { ...prev, [name]: settingValue }
      settingsRef.current = next
      return next
    })
  }

  const handleSubmit = () => {
    let raw: string

    if (mode === 'custom') {
      raw = customValue.trim()
    } else {
      if (!selectedValue) return
      raw = dynamic.stringify(
        selectedValue,
        Object.keys(settings).length > 0 ? settings : false
      )
      // stringify returns [[value]] — we need just the inner raw
      // Actually stringify returns the full [[type::key=value]] string
      // We need to strip the [[ and ]] delimiters since our serialiser adds them
      if (raw.startsWith('[[') && raw.endsWith(']]')) {
        raw = raw.slice(2, -2)
      }
    }

    if (!raw) return

    onSubmit(raw)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  // The category the selected value belongs to — the trigger renders the
  // dynamic-pill treatment (bolt + category + label) like the design.
  const selectedCategory = useMemo(
    () => choices.find(category => selectedValue in category.choices)?.name,
    [choices, selectedValue]
  )
  const selectedLabel = selectedValue
    ? dynamics.values[selectedValue]?.label ?? selectedValue
    : ''

  if (!modalContainer) return null

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      size="md"
      container={modalContainer}
      aria-labelledby="tf-dynamic-settings-title"
      showCloseButton
      className="tf-dynamic-settings-dialog"
    >
      <Modal.Head>
        <h3 id="tf-dynamic-settings-title" style={{ margin: 0 }}>
          Dynamic Field Settings
        </h3>
      </Modal.Head>
      <Modal.Body>
        <div className="tf-dynamic-settings">
          {/* Mode toggle */}
          <RadioGroup
            label="Field Type"
            value={mode}
            onChange={value => setMode(value as FieldMode)}
            name="dynamic-field-mode"
            className="tf-dynamic-settings__mode"
          >
            <Radio value="builtin">Built-in</Radio>
            <Radio value="custom">Custom</Radio>
          </RadioGroup>

          {/* Built-in mode */}
          {mode === 'builtin' && (
            <div className="tf-dynamic-settings__builtin">
              <Field>
                <Field.Label as="span">Select Type &amp; Meta Key</Field.Label>
                <Field.Control>
                  <SearchSelect
                    value={selectedValue || undefined}
                    onValueChange={value => handleBuiltinSelect(String(value))}
                    placeholder="Choose a dynamic value"
                  >
                    <SearchSelect.Trigger>
                      {selectedValue ? (
                        <span className="tf-dynamic-trigger-value">
                          <Icon name="system/bolt-fill" size="sm" />
                          <strong>{selectedCategory}</strong> {selectedLabel}
                        </span>
                      ) : undefined}
                    </SearchSelect.Trigger>
                    <SearchSelect.Content>
                      {choices.map(category => (
                        <SearchSelect.Group key={category.name}>
                          <SearchSelect.Label>{category.name}</SearchSelect.Label>
                          {Object.entries(category.choices).map(([key, label]) => (
                            <SearchSelect.Option key={key} value={key}>
                              {String(label)}
                            </SearchSelect.Option>
                          ))}
                        </SearchSelect.Group>
                      ))}
                    </SearchSelect.Content>
                  </SearchSelect>
                </Field.Control>
              </Field>
              {settingsForm && (
                <div className="tf-dynamic-settings__fields">
                  {settingsForm.map(field => (
                    <div
                      key={field.name}
                      className="tf-dynamic-settings__field"
                    >
                      <Control
                        {...field}
                        value={settings[field.name] ?? ''}
                        onChange={settingValue =>
                          updateSettings(field.name, settingValue)
                        }
                        visibility={{
                          condition: field.condition?.condition ?? false,
                          action: field.condition?.action ?? 'show',
                        }}
                        data={{
                          getValue: name =>
                            settingsRef.current[name] ?? '',
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Custom mode */}
          {mode === 'custom' && (
            <div className="tf-dynamic-settings__custom">
              <Field>
                <Field.Label>Custom key</Field.Label>
                <Field.Control>
                  <TextInput
                    value={customValue}
                    /* TUI TextInput is a native wrapper: onChange, not
                       onValueChange (which would silently fall into rest) */
                    onChange={e => setCustomValue(e.target.value)}
                    placeholder="e.g. post_meta::field=author"
                  />
                </Field.Control>
              </Field>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Foot className="tf-dynamic-settings__actions">
        <Button type="action" onPress={handleCancel}>
          Cancel
        </Button>
        <Button type="primary" onPress={handleSubmit}>
          {isEditing ? 'Update Field' : 'Add Field'}
        </Button>
      </Modal.Foot>
    </Modal>
  )
}

export default DynamicFieldSettings
