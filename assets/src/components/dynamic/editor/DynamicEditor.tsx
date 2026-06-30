import {
  useState,
  useCallback,
  useMemo,
} from 'react'

import { getConfig } from '../../../index.tsx'
import { useProseMirrorEditor } from '../../../prosemirror/dynamic-text/use-prosemirror-editor'
import { DynamicFieldSettings } from '../settings-modal'
import FieldWrapper from '../field-wrapper/FieldWrapper'
import { Button } from '../../base'

interface DynamicEditorProps {
  value: string
  defaultValue?: string
  onChange: (value: string) => void
  dynamic: any // DynamicAPI from dynamicValuesAPI()
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
  const [editingId, setEditingId] = useState<string | undefined>()
  const [editingRaw, setEditingRaw] = useState<string | undefined>()

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
   * Handle insert button click — open modal in insert mode.
   */
  const handleInsertClick = useCallback(() => {
    setEditingId(undefined)
    setEditingRaw(undefined)
    setModalOpen(true)
  }, [])

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
          readOnly
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
        className={`tui-input-group ${readOnly ? 'is-disabled' : ''}`}
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
      </div>

      {/* Hidden input for native form submission */}
      <input
        type="hidden"
        name={name ?? ''}
        value={value}
      />

      {/* Insert button */}
      {!readOnly && (
        <Button
          type="icon"
          className="tf-dynamic-wrapper-insert"
          contentVisuallyHidden={true}
          onPress={handleInsertClick}
        >
          Insert
        </Button>
      )}

      {/* Settings modal */}
      <DynamicFieldSettings
        open={modalOpen}
        onOpenChange={setModalOpen}
        dynamic={dynamic}
        editingId={editingId}
        editingRaw={editingRaw}
        onSubmit={handleModalSubmit}
      />
    </div>
  )
}

export default DynamicEditor
