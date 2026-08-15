import {
  useState,
  useEffect,
  useRef,
  useMemo
} from 'react'

import { useOverlayTrigger } from 'react-aria'
import { useOverlayTriggerState } from 'react-stately'

import { getConfig } from '../../../index.tsx'
import { IconButton, SearchSelect } from '@tangible/ui'
import { Button } from '../../base'
import DynamicFieldSettings from '../settings-modal/DynamicFieldSettings'
import { buildGroupedChoices, valueHasSettings } from '../choices'

/**
 * Accepted props:
 * - value
 * - onValueSelection
 * - isOpen
 */
const BaseWrapper = props => {

  /**
   * It's OK to return early even if hooks after because if props.config is false
   * it won't change during the component lifetime
   */
  if( props.config === false ) {
    return props.children
  }

  const { dynamics } = getConfig()

  const triggerRef = useRef()
  const wrapperRef = useRef(null)

  const [valueChange, setValueChange] = useState(false)

  // Values that declare settings route to the settings modal, prefilled with
  // the picked value (the legacy inline settings popover is gone).
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsRaw, setSettingsRaw] = useState(undefined)
  const [settingsMode, setSettingsMode] = useState('builtin')

  const state = useOverlayTriggerState({})
  const { triggerProps } = useOverlayTrigger(
    { type: 'dialog' },
    state,
    triggerRef
  )

  useEffect(() => {
    props.isOpen ? state.open() : state.close()
  }, [props.isOpen])

  /**
   * Workaround to not trigger props.onValueSelection too early
   */
  useEffect(() => {
    if( valueChange !== false ) {
      props?.onValueSelection(valueChange)
      setValueChange(false)
    }
  }, [valueChange])

  const saveDynamicValue = valueName => {

    if( ! valueName ) return;

    // "Custom value…" row → settings modal straight into custom mode
    if( valueName === 'tf::custom' ) {
      state.close()
      setSettingsRaw(undefined)
      setSettingsMode('custom')
      setSettingsOpen(true)
      return
    }

    if( valueHasSettings(dynamics, valueName) ) {
      state.close()
      setSettingsRaw(valueName)
      setSettingsMode('builtin')
      setSettingsOpen(true)
      return
    }

    setValueChange(
      props.config.stringify(valueName, false)
    )
    state.close()
  }

  const choices = useMemo(
    () => buildGroupedChoices(props.config, dynamics),
    []
  )

  /**
   * There are 2 wasy to display insert/clear button:
   * - 2 button after the fields
   * - Inside the input (only used for text currently)
   */
  const buttonType = props.buttonType ?? 'outside'
  const hasInsert  = !( props.readOnly || props.inputMasking ) && (buttonType === 'outside' || (! props.remove || props.remove.isDisabled))
  const hasClear   = !( props.readOnly || props.inputMasking ) && (buttonType === 'outside' || (props.remove && props.remove.isDisabled === false))

  const classes = `tf-dynamic-wrapper tf-dynamic-wrapper-buttons-${buttonType} ${props.className ?? ''}`

  /**
   * The value picker: TUI SearchSelect in external-trigger mode — the insert
   * button opens the panel anchored under the whole field.
   */
  const picker = (
    <SearchSelect
      open={ state.isOpen }
      onOpenChange={ open => { if( !open ) state.close() } }
      onValueChange={ value => saveDynamicValue(String(value)) }
      anchorRef={ wrapperRef }
      restoreFocusRef={ triggerRef }
      aria-label="Insert dynamic value"
    >
      <SearchSelect.Content>
        { choices.map(category => (
          <SearchSelect.Group key={ category.name }>
            <SearchSelect.Label>{ category.name }</SearchSelect.Label>
            { Object.entries(category.choices).map(([key, label]) => (
              <SearchSelect.Option key={ key } value={ key }>
                { String(label) }
              </SearchSelect.Option>
            )) }
          </SearchSelect.Group>
        )) }
        <SearchSelect.Option value="tf::custom" textValue="Custom">
          Custom value…
        </SearchSelect.Option>
      </SearchSelect.Content>
    </SearchSelect>
  )

  const insertIconButton = (
    <IconButton
      icon="system/bolt-plus-fill"
      label="Insert dynamic value"
      variant="ghost"
      theme="secondary"
      size="sm"
      className="tf-dynamic-wrapper-insert"
      ref={ triggerRef }
      { ...triggerProps }
      /* IconButton is a native button (onClick); react-aria's onPress in
         triggerProps is inert on it, so activation is wired explicitly */
      onClick={ () => state.open() }
      aria-haspopup="dialog"
      aria-expanded={ state.isOpen }
    />
  )

  const clearIconButton = (
    <IconButton
      icon="system/close"
      label="Clear dynamic value"
      variant="ghost"
      theme="secondary"
      size="sm"
      className="tf-dynamic-wrapper-clear"
      disabled={ props.remove?.isDisabled }
      onClick={ props.remove?.onPress }
    />
  )

  return(
    <div className={ classes } data-dynamic="true" ref={ wrapperRef }>
      { buttonType === 'inside'
        /* Field + affordances read as ONE control: an input group with the
           icon buttons as suffix appends */
        ? <div className="tui-input-group tf-dynamic-group">
            { props.children }
            { hasInsert &&
              <span className="tui-input-group__suffix">{ insertIconButton }</span> }
            { hasClear &&
              <span className="tui-input-group__suffix">{ clearIconButton }</span> }
          </div>
        : <>
            { props.children }
            { hasInsert &&
              <Button
                type="action"
                className="tf-dynamic-wrapper-insert"
                ref={ triggerRef }
                { ...triggerProps }
              >
                Insert
              </Button> }
            { hasClear &&
              <Button
                type="action"
                className="tf-dynamic-wrapper-clear"
                { ...props.remove }
              >
                Clear
              </Button> }
          </> }
      { picker }
      {/* Settings modal for values that declare fields. onSubmit gives the
          raw WITHOUT [[ ]] delimiters (the editor serialiser re-adds them) —
          this path stores the full token, so wrap. */}
      <DynamicFieldSettings
        open={ settingsOpen }
        onOpenChange={ setSettingsOpen }
        dynamic={ props.config }
        editingRaw={ settingsRaw }
        defaultMode={ settingsMode }
        onSubmit={ raw => setValueChange(`[[${raw}]]`) }
      />
    </div>
  )
}

export default BaseWrapper
