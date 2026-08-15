import { 
  useState,
  useEffect,
  useRef,
  useMemo
} from 'react'

import {
  DismissButton,
  useOverlay,
  useOverlayTrigger,
  mergeProps,
} from 'react-aria'

import { getConfig } from '../../../index.tsx'
import Control from '../../../Control'

import { useOverlayTriggerState } from 'react-stately'
import { IconButton, SearchSelect } from '@tangible/ui'
import { Button, Title } from '../../base'

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
  const overlayRef = useRef()
  const wrapperRef = useRef(null)

  const [value, setValue] = useState(false)
  const [settingsForm, setSettingsForm] = useState(false)
  /**
   * SearchSelect's onOpenChange(false) fires in the same event batch as the
   * selection that may have just revealed the settings form — read the
   * fresh value through a ref so we don't close the trigger state under it.
   */
  const settingsFormRef = useRef(false)
  const [settings, setSettings] = useState({})
  const [valueChange, setValueChange] = useState(false)

  const state = useOverlayTriggerState({})
  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type: 'dialog' },
    state,
    triggerRef
  )

  const { overlayProps: dismissProps } = useOverlay(
    {
      isOpen        : state.isOpen,
      onClose       : state.close,
      isDismissable : true
    },
    overlayRef
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

    const args = dynamics.values[ valueName ]?.fields
    setValue(valueName)

    if( ! Array.isArray(args) || args.length === 0 ) {
      return selectAndClose(valueName)
    }

    settingsFormRef.current = args
    setSettingsForm(args)
  }

  const selectAndClose = value => {
    
    setValueChange(
      props.config.stringify(value, settings ?? false)
    )

    resetAndClose()
  }

  const resetAndClose = () => {

    setValue(false)
    settingsFormRef.current = false
    setSettingsForm(false)
    setSettings(false)

    state.close()
  }

  /**
   * Create an array usable by a combobox list that contains the dynamic values available
   */
  const choices = useMemo(() => {

    const allowedTypes = props.config.getTypes()
    const categoryKeys = props.config.getCategories()

    const categories = categoryKeys.map(categoryKey => {
      
      const category = dynamics.categories[ categoryKey ]
      const categoryChoices = Object.keys(dynamics.values)
        .filter(value => (
          category.values.includes(value) && allowedTypes.includes(dynamics.values[value]?.type)
        ))
        .reduce((choices, key) => ({
          ...choices,
          [key]: dynamics.values[key].label ?? key
        }), {},)
      
      return {
        name: category.label,
        choices: categoryChoices
      }
    })

    // Remove empty categories
    return categories.filter(category => (
      Object.keys(category.choices).length !== 0
    ))
  }, [])

  /**
   * Not sure why, but without a ref the state value is always empty when used inside getValue()
   */
  const settingsRef = useRef(settings)
  const updateSettings = (name, settingValue) => {
    setSettings(
      settingsRef.current = {
        ...settings,
        [name]: settingValue
      }
    )
  }
  
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
   * button opens the panel anchored under the whole field (no intermediate
   * popover-with-a-combobox). Values with settings still route to the
   * settings form below via saveDynamicValue.
   */
  const picker = (
    <SearchSelect
      open={ state.isOpen && !settingsForm }
      onOpenChange={ open => {
        if( !open && !settingsFormRef.current ) state.close()
      } }
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
      {state.isOpen && settingsForm &&
        /**
         * Settings sub-form for values that declare fields. tui-interface
         * class keeps TUI portals inside the popover.
         *
         * @see getPortalRootFor() in @tangible/ui/utils/portal.js
         */
        (<div
          className="tf-dynamic-wrapper-popover tui-interface"
          ref={ overlayRef }
          { ...mergeProps(overlayProps, dismissProps) }
        >
          { settingsForm
            && <div className="tf-dynamic-wrapper-popover-form">
                <Title level={4}>
                  Dynamic value settings
                </Title>
                { dynamics.values[ value ].description && 
                  <i>{ dynamics.values[ value ].description }</i> }
                { settingsForm.map(field => (
                  <div className="tf-dynamic-wrapper-popover-field">
                    <Control
                      { ...field } 
                      value={ settings[field.name] ?? '' }
                      onChange={ settingValue => updateSettings(field.name, settingValue) }
                      visibility={{
                        condition: field.condition?.condition ?? false,
                        action: field.condition?.action ?? 'show'
                      }}
                      data={{
                        getValue: name => settingsRef.current[name] ?? ''
                      }}
                    />
                  </div>
                )) }
                <div className="tf-dynamic-wrapper-popover-buttons">
                  <Button type="action" onPress={ () => selectAndClose(value) }>
                    Add
                  </Button>
                  <Button type="action" onPress={ resetAndClose }>
                    Close
                  </Button>
                </div>
              </div> }
          <DismissButton onDismiss={ state.close } />
        </div>
      ) }
    </div>
  )
}

export default BaseWrapper
