import {
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react'

import { getConfig } from '../../../index.tsx'
import { useProseMirrorEditor } from '../../../prosemirror/dynamic-text/use-prosemirror-editor'
import { DynamicFieldSettings } from '../settings-modal'
import FieldWrapper from '../field-wrapper/FieldWrapper'
import { buildGroupedChoices, valueHasSettings } from '../choices'
import { IconButton, SearchSelect } from '@tangible/ui'

interface DynamicEditorProps {
  value: string
  defaultValue?: string
  onChange: (value: string) => void
  dynamic: any // DynamicAPI from dynamicValuesAPI()
  /** Control size — threads to the input group's is-size-* ladder. */
  size?: 'sm' | 'md' | 'lg'
  name?: string
  placeholder?: string
  readOnly?: boolean
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  singleLine?: boolean
  className?: string
  inputProps?: Record<string, any>
}

const DynamicEditor = ({
  value,
  defaultValue,
  onChange,
  dynamic,
  size = 'md',
  name,
  placeholder,
  readOnly = false,
  prefix,
  suffix,
  singleLine = true,
  className = '',
  inputProps = {},
}: DynamicEditorProps) => {
  const { dynamics } = getConfig()

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'builtin' | 'custom'>('builtin')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | undefined>()
  const [editingRaw, setEditingRaw] = useState<string | undefined>()

  // External-trigger SearchSelect wiring: the panel anchors under the whole
  // input group; focus returns to the bolt-plus IconButton.
  const groupRef = useRef<HTMLDivElement | null>(null)
  const insertButtonRef = useRef<HTMLButtonElement | null>(null)

  /**
   * Build a label resolver from the dynamic values config.
   */
  const getLabel = useCallback(
    (raw: string): { category: string; name: string } => {
      const parsed = dynamic.parse(raw)
      if (!parsed || !parsed.type) {
        return { category: '', name: raw }
      }

      const valueConfig = dynamics.values[parsed.type]
      const label = valueConfig?.label ?? parsed.type

      // Find which category this value belongs to
      let categoryLabel = ''
      const categoryKeys = dynamic.getCategories()
      for (const key of categoryKeys) {
        const cat = dynamics.categories[key]
        if (cat?.values?.includes(parsed.type)) {
          categoryLabel = cat.label ?? key
          break
        }
      }

      return { category: categoryLabel, name: label }
    },
    [dynamic]
  )

  /**
   * Handle opening the settings modal for editing a token.
   */
  const handleEditToken = useCallback(
    (id: string) => {
      const raw = findTokenRaw(id)
      setEditingId(id)
      setEditingRaw(raw)
      setModalMode('builtin')
      setModalOpen(true)
    },
    []
  )

  const {
    containerRef,
    focus,
    insertDynamicValue,
    updateDynamicValueById,
    findTokenRaw,
  } = useProseMirrorEditor({
    value,
    defaultValue,
    onChange,
    getLabel,
    onEditToken: handleEditToken,
    readOnly,
    placeholder,
    singleLine,
  })

  /**
   * Click anywhere on the input group (including prefix/suffix) → focus editor.
   * Prefix/suffix have pointer-events: none (from tui-input-group__prefix/suffix),
   * so clicks on them fall through to the group container.
   */
  const handleGroupClick = useCallback(
    (e: React.MouseEvent) => {
      // Don't steal focus if they clicked on an interactive element inside a slot
      const target = e.target as HTMLElement
      if (target.closest('button, a, [role="button"]')) return
      // Don't refocus if click was inside the ProseMirror editor itself
      if (target.closest('.ProseMirror')) return
      focus()
    },
    [focus]
  )

  /**
   * Insert button — ALWAYS opens the insert panel (SearchSelect). The
   * settings modal is reserved for editing (kebab/double-click) and for
   * picked values that declare settings.
   */
  const handleInsertClick = useCallback(() => {
    setEditingId(undefined)
    setEditingRaw(undefined)
    setPickerOpen(!pickerOpen)
  }, [pickerOpen])

  const choices = useMemo(
    () => buildGroupedChoices(dynamic, dynamics),
    [dynamic, dynamics]
  )

  /**
   * A value picked from the insert panel: insert immediately, unless it
   * declares settings — then route to the settings modal prefilled with it.
   */
  const handlePickerSelect = useCallback(
    (picked: string | number) => {
      const valueName = String(picked)

      // "Custom value…" row → settings modal straight into custom mode
      if (valueName === 'tf::custom') {
        setEditingId(undefined)
        setEditingRaw(undefined)
        setModalMode('custom')
        setModalOpen(true)
        return
      }

      if (valueHasSettings(dynamics, valueName)) {
        setEditingId(undefined)
        setEditingRaw(valueName)
        setModalMode('builtin')
        setModalOpen(true)
        return
      }

      let raw = dynamic.stringify(valueName, false)
      // The serialiser re-adds the [[ ]] delimiters
      if (raw.startsWith('[[') && raw.endsWith(']]')) {
        raw = raw.slice(2, -2)
      }
      insertDynamicValue(raw)
    },
    [dynamic, dynamics, insertDynamicValue]
  )

  /**
   * Handle modal submit — either insert new or update existing.
   */
  const handleModalSubmit = useCallback(
    (raw: string) => {
      if (editingId) {
        updateDynamicValueById(editingId, raw)
      } else {
        insertDynamicValue(raw)
      }
      setEditingId(undefined)
      setEditingRaw(undefined)
    },
    [editingId, insertDynamicValue, updateDynamicValueById]
  )

  /**
   * Replace mode — delegate to FieldWrapper (no ProseMirror needed).
   */
  if (dynamic.getMode() === 'replace') {
    // FieldWrapper is an untyped forwardRef component — cast to suppress TS
    const Wrapper = FieldWrapper as any
    return (
      <Wrapper
        dynamic={dynamic}
        value={value}
        size={size}
        onValueSelection={onChange}
        onValueRemove={() => onChange('')}
        inputProps={inputProps}
        readOnly={readOnly}
        buttonType="inside"
        name={name}
      >
        <input {...inputProps} type="hidden" value={value} />
        <input
          type="text"
          className="tf-dynamic-text-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          readOnly={readOnly}
          placeholder={placeholder}
        />
      </Wrapper>
    )
  }

  /**
   * Insert mode — ProseMirror editor.
   */
  const editorClasses = [
    'tf-dynamic-editor',
    singleLine && 'is-single-line',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  // Collect ARIA props from Field.Control pass-through
  const ariaProps: Record<string, any> = {}
  for (const key of [
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
    'aria-invalid',
    'aria-required',
  ] as const) {
    if (inputProps[key]) ariaProps[key] = inputProps[key]
  }

  return (
    <div
      className="tf-dynamic-wrapper tf-dynamic-wrapper-buttons-inside"
      data-dynamic="true"
    >
      {/* tui-input-group: consistent prefix/input/suffix wrapper from TUI */}
      <div
        ref={groupRef}
        className={[
          'tui-input-group',
          size !== 'md' && `is-size-${size}`,
          readOnly && 'is-disabled',
        ].filter(Boolean).join(' ')}
        onClick={handleGroupClick}
      >
        {prefix && (
          <span className="tui-input-group__prefix">{prefix}</span>
        )}
        <div
          ref={containerRef}
          className={editorClasses}
          role="textbox"
          aria-multiline={!singleLine}
          aria-readonly={readOnly || undefined}
          aria-placeholder={placeholder}
          {...ariaProps}
        />
        {suffix && (
          <span className="tui-input-group__suffix">{suffix}</span>
        )}
        {/* Insert affordance: an input-group append, not a floating button */}
        {!readOnly && (
          <span className="tui-input-group__suffix">
            <IconButton
              ref={insertButtonRef}
              icon="system/bolt-plus-fill"
              label="Insert dynamic value"
              variant="ghost"
              theme="secondary"
              size="sm"
              className="tf-dynamic-wrapper-insert"
              aria-haspopup="dialog"
              aria-expanded={pickerOpen}
              onClick={handleInsertClick}
            />
          </span>
        )}
      </div>

      {/* Hidden input for native form submission */}
      <input
        type="hidden"
        name={name ?? ''}
        value={value}
      />


      {/* Insert panel — anchored under the field */}
      <SearchSelect
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onValueChange={handlePickerSelect}
        anchorRef={groupRef}
        restoreFocusRef={insertButtonRef}
        aria-label="Insert dynamic value"
      >
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
          <SearchSelect.Option value="tf::custom" textValue="Custom">
            Custom value…
          </SearchSelect.Option>
        </SearchSelect.Content>
      </SearchSelect>

      {/* Settings modal — editing (kebab/double-click) and picked values
          that declare settings */}
      <DynamicFieldSettings
        open={modalOpen}
        onOpenChange={setModalOpen}
        dynamic={dynamic}
        editingId={editingId}
        editingRaw={editingRaw}
        defaultMode={modalMode}
        onSubmit={handleModalSubmit}
      />
    </div>
  )
}

export default DynamicEditor
