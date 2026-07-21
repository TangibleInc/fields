import {
  useState,
  useMemo,
  useEffect,
  useRef,
  useContext,
} from 'react'

import {
  Overlay,
  useModalOverlay,
  useDialog,
} from 'react-aria'
import { useOverlayTriggerState } from 'react-stately'

import { ControlContext } from '../../../context'
import { getConfig } from '../../../index.tsx'
import { Button, Title } from '../../base'
import ComboBox from '../../field/combo-box'
import Control from '../../../Control'

interface DynamicFieldSettingsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dynamic: any // DynamicAPI from dynamicValuesAPI()
  editingId?: string
  editingRaw?: string
  onSubmit: (raw: string) => void
}

type FieldMode = 'builtin' | 'custom'

const DynamicFieldSettings = ({
  open,
  onOpenChange,
  dynamic,
  editingId,
  editingRaw,
  onSubmit,
}: DynamicFieldSettingsProps) => {
  if (!dynamic) return null

  const { dynamics } = getConfig()
  const control = useContext(ControlContext)

  const state = useOverlayTriggerState({
    isOpen: open,
    onOpenChange,
  })

  // Sync external open state
  useEffect(() => {
    if (open && !state.isOpen) state.open()
    if (!open && state.isOpen) state.close()
  }, [open])

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
      setMode('builtin')
      setSelectedValue('')
      setCustomValue('')
    }
  }, [open, editingRaw])

  /**
   * Build choices for the combobox from dynamic categories
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

  if (!state.isOpen) return null

  return (
    <SettingsOverlay
      state={state}
      control={control}
      title="Dynamic Field Settings"
    >
      <div className="tf-dynamic-settings">
        {/* Mode toggle */}
        <div className="tf-dynamic-settings__mode">
          <label className="tf-dynamic-settings__radio">
            <input
              type="radio"
              name="dynamic-field-mode"
              value="builtin"
              checked={mode === 'builtin'}
              onChange={() => setMode('builtin')}
            />
            Built-in
          </label>
          <label className="tf-dynamic-settings__radio">
            <input
              type="radio"
              name="dynamic-field-mode"
              value="custom"
              checked={mode === 'custom'}
              onChange={() => setMode('custom')}
            />
            Custom
          </label>
        </div>

        {/* Built-in mode */}
        {mode === 'builtin' && (
          <div className="tf-dynamic-settings__builtin">
            <ComboBox
              choices={choices}
              label="Select dynamic value"
              labelVisuallyHidden={false}
              value={selectedValue}
              onChange={handleBuiltinSelect}
              showButton={true}
            />
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
            <label className="tf-dynamic-settings__label">
              Custom key
              <input
                type="text"
                className="tf-dynamic-settings__input"
                value={customValue}
                onChange={e => setCustomValue(e.target.value)}
                placeholder="e.g. post_meta::field=author"
              />
            </label>
          </div>
        )}

        {/* Actions */}
        <div className="tf-dynamic-settings__actions">
          <Button type="action" onPress={handleCancel}>
            Cancel
          </Button>
          <Button type="action" onPress={handleSubmit}>
            {isEditing ? 'Update Field' : 'Add Field'}
          </Button>
        </div>
      </div>
    </SettingsOverlay>
  )
}

/**
 * Modal overlay wrapper, mirrors Fields' Modal pattern.
 */
const SettingsOverlay = ({ state, control, title, children }) => {
  const modalRef = useRef(null)
  const dialogRef = useRef(null)

  const { modalProps, underlayProps } = useModalOverlay({ isDismissable: true }, state, modalRef)
  const { dialogProps } = useDialog({ role: 'dialog' }, dialogRef)

  return (
    <Overlay portalContainer={control.portalContainer}>
      <div className={control.wrapper}>
        <div
          className="tf-modal"
          {...underlayProps}
          style={{ zIndex: 1000000 }}
        >
          <div
            className="tf-modal-container"
            ref={modalRef}
            {...modalProps}
          >
            <div
              className="tf-dialog"
              {...dialogProps}
              ref={dialogRef}
            >
              {title && <Title level={4}>{title}</Title>}
              <div className="tf-dialog-content">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </Overlay>
  )
}

export default DynamicFieldSettings
