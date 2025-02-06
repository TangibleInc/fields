import { 
  forwardRef,
  useState,
  useEffect,
  useRef
} from 'react'

import { 
  useOverlayTrigger, 
  DismissButton 
} from 'react-aria'

import { 
  Button,
  Label,
  Description
} from '../../../base'

import { useOverlayTriggerState } from 'react-stately'
import ComboBox from './../ComboBox'

/**
 * /!\ This layout support only multiple values 
 */
const SimpleMutliple = forwardRef(({
  parent,
  descriptionProps,
  labelProps,
  inputProps,
  itemProps,
  multiple,
  state,
  ...props
}, ref) => {

  if ( ! multiple ) {
    throw new Error( 'The simple-multiple layout only support multiple values' )
  }

  const {
    add,
    getDisabledValues,
    remove
  } = multiple

  const [values, setValue] = useState(multiple.values ?? [])
  useEffect(() => setValue(multiple.values), [multiple.values])

  const triggerRef = useRef()
  const overlayState = useOverlayTriggerState({})
  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type: 'dialog' },
    overlayState,
    triggerRef
  )

  /**
   * If is array, it means choices contains categories
   */
  const choices = Array.isArray(parent.choices)
    ? parent.choices.reduce(
      (data, category) => ({
        ...data,
        ...(category.choices ?? {})
      }), {})
    : parent.choices

  return (
    <div className="tf-multiple-combobox" data-enabled={ ! parent.readOnly }>
      { props.label &&
        <Label labelProps={ labelProps } parent={ parent }>
          { props.label }
        </Label> }
      <div className="tf-multiple-combobox-container">
        <div ref={ ref.current.input } className="tf-multiple-combobox-values" { ...inputProps }>
          { values.length === 0
            ? parent.placeholder ?? 'No item selected'
            : values.map(
              (value, i) => (
                <span key={ value.key ?? i } className="tf-combo-box-item">
                  <span>
                    { parent.isAsync
                      ? value.label
                      : choices[value] ?? '' }
                  </span>
                  { parent.readOnly !== true &&
                    <Button onPress={ () => remove(i) }>x</Button> }
                </span>
              )
            )}
        </div>
        <Button
          type="action"
          ref={ triggerRef }
          { ...triggerProps }
          isDisabled={ parent.readOnly }
        >
          Add
        </Button>
        { overlayState.isOpen && (
          <div className="tf-popover" ref={ ref.current.overlay } { ...overlayProps }>
            <ComboBox
              focusStrategy={ 'first' }
              label={ 'Select an item to add' }
              labelVisuallyHidden={ true }
              description={ false }
              disabledKeys={ getDisabledValues() }
              autoFocus={ true }
              multiple={ true }
              showButton={ false }
              menuTrigger="focus"
              onSelectionChange={ value => {
                if( ! value ) return;
                add( value )
                overlayState.close()
              }}
              onFocusChange={ isFocus => isFocus 
                ? (! overlayState.isOpen && overlayState.open())
                : overlayState.close()
              }
              isAsync={ parent.isAsync ?? false }
              { ...itemProps }
            >
              { parent.children }
            </ComboBox>
            <DismissButton onDismiss={ overlayState.close } />
          </div> ) }
      </div>
      { props.description &&
        <Description descriptionProps={ descriptionProps } parent={ parent }>
          { props.description }
        </Description> }
    </div>
  )
})

export default SimpleMutliple
