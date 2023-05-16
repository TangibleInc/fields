import { 
  useState,
  useEffect,
  useRef
} from 'react'

import { 
  DismissButton,
  useOverlayTrigger,
} from 'react-aria'

import Control from '../../../Control'

import { useOverlayTriggerState } from 'react-stately'
import { Button, Title } from '../../base'
import { ComboBox } from '../../field'

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

  const { dynamics } = TangibleFields

  const triggerRef = useRef()
  const overlayRef = useRef()

  const [value, setValue] = useState(false)
  const [settingsForm, setSettingsForm] = useState(false)
  const [settings, setSettings] = useState({})
  const [valueChange, setValueChange] = useState(false)

  const state = useOverlayTriggerState({})
  const { triggerProps, overlayProps } = useOverlayTrigger(
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

    const args = dynamics[ valueName ]?.settings
    setValue(valueName)

    if( ! Array.isArray(args) || args.length === 0 ) {
      return selectAndClose(valueName)
    }
    
    setSettingsForm(args) 
  }

  const selectAndClose = name => {
    
    setValueChange(
      props.config.stringify(name, settings ?? false)
    )

    setValue(false)
    setSettingsForm(false)
    setSettings(false)
    
    state.close()
  } 

  const choices = Object.keys(dynamics).reduce(
    (choices, key) => (
      props.config.getTypes().includes(dynamics[key]?.type)
      ? {
          ...choices,
          [key]: dynamics[key].label ?? key
        } 
      : choices
    ), {}
  )

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

  return(
    <div className="tf-dynamic-wrapper">
      { props.children }
      <Button type="action" ref={ triggerRef } { ...triggerProps }>
        Insert
      </Button>
      { props.remove && 
        <Button type="action" { ...props.remove }>
          Remove
        </Button> }
      { state.isOpen && (
        <div className="tf-dynamic-wrapper-popover" ref={ overlayRef } { ...overlayProps }>
          { settingsForm
            ? <div className="tf-dynamic-wrapper-popover-form">
                <Title level={4}>
                  Dynamic value settings
                </Title>
                { settingsForm.map(field => (
                  <div className="tf-dynamic-wrapper-popover-field">
                    <Control
                      { ...field } 
                      value={ settings[field.name] ?? '' }
                      onChange={ settingValue => updateSettings(field.name, settingValue) }
                      visibility={{
                        condition: field.condition?.condition ?? false,
                        action: field.condition?.action ?? 'show',
                        getValue: name => settingsRef.current[name] ?? ''
                      }}
                    />
                  </div>
                )) }
                <Button type="action" onPress={ () => selectAndClose(value) }>
                  Add
                </Button>
              </div>
            : <ComboBox 
                choices={ choices }
                autoFocus={ true }
                showButton={ false }
                onChange={ saveDynamicValue }
                onFocusChange={ isFocus =>
                  isFocus 
                    ? (! state.isOpen && state.open())
                    : state.close() 
                }
              /> }
          <DismissButton onDismiss={ state.close } />
        </div>
      ) }
    </div>
  )
}

export default BaseWrapper
