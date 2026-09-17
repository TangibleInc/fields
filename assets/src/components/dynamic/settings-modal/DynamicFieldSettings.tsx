import {
  useState,
  useMemo,
  useEffect,
  useContext,
} from 'react'

import { Modal, SearchSelect, Field, TextInput, Icon } from '@tangible/ui'

import { getConfig } from '../../../index.tsx'
import { ControlContext } from '../../../context'
import { Button } from '../../base'
import usePortalContainer from '../../base/modal/usePortalContainer'
import { RadioGroup } from '../../field/radio/RadioGroup'
import Radio from '../../field/radio/Radio'
import { buildGroupedChoices } from '../choices'
import DynamicValueSettings from './DynamicValueSettings'
import { EnsureControlContext } from './ensure-context'

export type DynamicFieldMode = 'builtin' | 'custom'

export interface DynamicFieldSettingsLabels {
  title: string
  fieldType: string
  builtin: string
  custom: string
  select: string
  selectPlaceholder: string
  customKey: string
  customPlaceholder: string
  cancel: string
  add: string
  update: string
}

export const defaultDynamicFieldSettingsLabels: DynamicFieldSettingsLabels = {
  title: 'Dynamic Field Settings',
  fieldType: 'Field Type',
  builtin: 'Built-in',
  custom: 'Custom',
  select: 'Select Type & Meta Key',
  selectPlaceholder: 'Choose a dynamic value',
  customKey: 'Custom key',
  customPlaceholder: 'e.g. post_meta::field=author',
  cancel: 'Cancel',
  add: 'Add Field',
  update: 'Update Field',
}

/** What was picked, alongside the raw reference `onSubmit` receives. */
export interface DynamicFieldSettingsSubmitMeta {
  mode: DynamicFieldMode
  /** The value name (built-in) or the custom raw. */
  value: string
  /** Display label of the pick. */
  label: string
  /** Label of the category the pick belongs to, when it belongs to one. */
  group?: string
  settings: Record<string, any>
}

export interface DynamicFieldSettingsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** DynamicAPI from dynamicValuesAPI() or createDynamicValuesAPI(). */
  dynamic: any
  editingId?: string
  editingRaw?: string
  /** Mode for fresh opens (no editingRaw) — the insert panel's
      "Custom value…" row opens straight into custom mode. */
  defaultMode?: DynamicFieldMode
  /**
   * Which modes the dialog offers. One mode hides the Field Type toggle.
   * @default ['builtin', 'custom']
   */
  modes?: DynamicFieldMode[]
  /** Override any of the dialog's strings. */
  labels?: Partial<DynamicFieldSettingsLabels>
  /**
   * Where the dialog mounts. Defaults to a wrapper created inside the
   * control context's portal container (see usePortalContainer). A given
   * container receives the interface wrapper classes (tf-interface,
   * tf-context-<name>, tui-interface) while the dialog is mounted: the
   * module's styles are scoped under them, and TUI portals the pickers'
   * panels into the nearest .tui-interface — that container.
   */
  container?: HTMLElement | null
  /**
   * The tf-context name used for the interface wrapper when the dialog is
   * rendered outside any field (no ControlContext above it), e.g. 'wp'.
   */
  context?: string
  /** The raw reference WITHOUT [[ ]] delimiters, and what was picked. */
  onSubmit: (raw: string, meta: DynamicFieldSettingsSubmitMeta) => void
}

const DynamicFieldSettings = ({
  open,
  onOpenChange,
  dynamic,
  editingId,
  editingRaw,
  defaultMode = 'builtin',
  modes = ['builtin', 'custom'],
  labels: labelsProp,
  container,
  context,
  onSubmit,
}: DynamicFieldSettingsProps) => {
  if (!dynamic) return null

  const { dynamics } = getConfig()
  const labels = { ...defaultDynamicFieldSettingsLabels, ...(labelsProp ?? {}) }
  const availableModes: DynamicFieldMode[] = modes.length ? modes : ['builtin']
  const initialMode: DynamicFieldMode = availableModes.includes(defaultMode)
    ? defaultMode
    : availableModes[0]

  /**
   * TUI Modal portals itself; the hook gives it a container that carries
   * the global context classes so our styles still apply inside it — unless
   * the consumer names one
   */
  const fallbackContainer = usePortalContainer(open && !container)
  const modalContainer = container ?? fallbackContainer

  // A consumer's container must carry the wrapper classes our styles and
  // TUI's portal roots key on; add what is missing for the dialog's lifetime.
  const existingControl = useContext(ControlContext)
  const contextName = context ?? existingControl?.name ?? 'default'
  useEffect(() => {
    if (!container) return
    const wanted = ['tf-interface', `tf-context-${contextName}`, 'tui-interface']
    const added = wanted.filter(className => !container.classList.contains(className))
    added.forEach(className => container.classList.add(className))
    return () => added.forEach(className => container.classList.remove(className))
  }, [container, contextName])

  const [mode, setMode] = useState<DynamicFieldMode>(initialMode)
  const [selectedValue, setSelectedValue] = useState('')
  const [customValue, setCustomValue] = useState('')
  const [settings, setSettings] = useState<Record<string, any>>({})

  const isEditing = editingId !== undefined

  /** The registry's categories, filtered to the API's types and categories */
  const choices = useMemo(() => buildGroupedChoices(dynamic, dynamics), [])

  const hasSettings = (value: string) => {
    const args = dynamics.values[value]?.fields
    return Array.isArray(args) && args.length > 0
  }

  // Parse editingRaw into initial state when modal opens
  useEffect(() => {
    if (!open) return

    setSettings({})

    if (editingRaw) {
      const parsed = dynamic.parse(editingRaw)
      if (parsed && parsed.type && dynamics.values[parsed.type]) {
        setMode('builtin')
        setSelectedValue(parsed.type)
        setCustomValue('')
        if (parsed.fields) setSettings(parsed.fields)
      } else if (availableModes.includes('custom')) {
        setMode('custom')
        setCustomValue(editingRaw)
        setSelectedValue('')
      } else {
        setMode('builtin')
        setSelectedValue('')
        setCustomValue('')
      }
    } else {
      setMode(initialMode)
      setSelectedValue('')
      setCustomValue('')
    }
  }, [open, editingRaw, initialMode])

  const handleBuiltinSelect = (valueName: string) => {
    if (!valueName) return
    setSelectedValue(valueName)
    setSettings({})
  }

  const handleSubmit = () => {
    let raw: string
    let meta: DynamicFieldSettingsSubmitMeta

    if (mode === 'custom') {
      raw = customValue.trim()
      meta = { mode, value: raw, label: raw, settings: {} }
    } else {
      if (!selectedValue) return
      const group = choices.find(category => selectedValue in category.choices)
      const label = String(group?.choices[selectedValue] ?? selectedValue)
      // Blank settings add nothing but noise to the token (the parser
      // defaults a missing setting to '' anyway), so only filled ones
      // travel: [[user_meta::meta_name=x]], not [[user_meta::source=::meta_name=x]]
      const filled = Object.fromEntries(
        Object.entries(settings).filter(([, v]) => v !== '' && v !== null && v !== undefined)
      )
      raw = dynamic.stringify(
        selectedValue,
        Object.keys(filled).length > 0 ? filled : false
      )
      // stringify returns the full [[type::key=value]] token; the raw
      // reference is its inside — consumers add their own delimiters
      if (raw.startsWith('[[') && raw.endsWith(']]')) {
        raw = raw.slice(2, -2)
      }
      meta = { mode, value: selectedValue, label, group: group?.name, settings: filled }
    }

    if (!raw) return

    onSubmit(raw, meta)
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
    ? String(
        choices.find(category => selectedValue in category.choices)?.choices[selectedValue]
          ?? dynamics.values[selectedValue]?.label
          ?? selectedValue
      )
    : ''

  if (!modalContainer) return null

  return (
    <EnsureControlContext context={context} portalContainer={container}>
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
          {labels.title}
        </h3>
      </Modal.Head>
      <Modal.Body>
        <div className="tf-dynamic-settings">
          {/* Mode toggle — only when there is a choice to make */}
          {availableModes.length > 1 && (
            <RadioGroup
              label={labels.fieldType}
              value={mode}
              onChange={value => setMode(value as DynamicFieldMode)}
              name="dynamic-field-mode"
              className="tf-dynamic-settings__mode"
            >
              {availableModes.includes('builtin') && (
                <Radio value="builtin">{labels.builtin}</Radio>
              )}
              {availableModes.includes('custom') && (
                <Radio value="custom">{labels.custom}</Radio>
              )}
            </RadioGroup>
          )}

          {/* Built-in mode */}
          {mode === 'builtin' && (
            <div className="tf-dynamic-settings__builtin">
              <Field>
                <Field.Label as="span">{labels.select}</Field.Label>
                <Field.Control>
                  <SearchSelect
                    value={selectedValue || undefined}
                    onValueChange={value => handleBuiltinSelect(String(value))}
                    placeholder={labels.selectPlaceholder}
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
                            <SearchSelect.Option key={key} value={key} textValue={String(label)}>
                              {String(label)}
                            </SearchSelect.Option>
                          ))}
                        </SearchSelect.Group>
                      ))}
                    </SearchSelect.Content>
                  </SearchSelect>
                </Field.Control>
              </Field>
              {selectedValue && hasSettings(selectedValue) && (
                <DynamicValueSettings
                  key={selectedValue}
                  valueName={selectedValue}
                  settings={settings}
                  onChange={setSettings}
                />
              )}
            </div>
          )}

          {/* Custom mode */}
          {mode === 'custom' && (
            <div className="tf-dynamic-settings__custom">
              <Field>
                <Field.Label>{labels.customKey}</Field.Label>
                <Field.Control>
                  <TextInput
                    value={customValue}
                    /* TUI TextInput is a native wrapper: onChange, not
                       onValueChange (which would silently fall into rest) */
                    onChange={e => setCustomValue(e.target.value)}
                    placeholder={labels.customPlaceholder}
                  />
                </Field.Control>
              </Field>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Foot className="tf-dynamic-settings__actions">
        <Button type="action" onPress={handleCancel}>
          {labels.cancel}
        </Button>
        <Button type="primary" onPress={handleSubmit}>
          {isEditing ? labels.update : labels.add}
        </Button>
      </Modal.Foot>
    </Modal>
    </EnsureControlContext>
  )
}

export default DynamicFieldSettings
