import {
  useEffect,
  useState, 
  useRef 
} from 'react'

import { 
  useOverlayTrigger, 
  useTextField, 
  DismissButton 
} from 'react-aria'

import { useOverlayTriggerState } from 'react-stately'
import { getOptions } from '../../../utils'
import { getAsyncProps } from './async'

import { 
  Button,
  Label,
  Description 
} from '../../base'

import ComboBox from './ComboBox'

/**
 * Wrapper we add around the ComboBox component when we need to support multiple values 
 */
const MultipleComboBox = props => {

  /**
   * The value is different according to if we get the item list in async mode or not
   * 
   * If it's the case, the initial value will be an array of object, that contains the
   * value and the label for each item selected
   * 
   * Otherwise, it's a comma separated string with each value
   */
  const [values, setValues] = useState(
    props.value && Array.isArray(props.value)
      ? props.value
      : (props.value && ! props.isAsync ? props.value.split(',') : [])
  )

  const itemProps = { ...(props.isAsync
    ? getAsyncProps(props)
    : {
      defaultItems: getOptions(props.choices ?? {})
    })
  }

  const input = useRef(null)
  const triggerRef = useRef(null)
  const overlayRef = useRef(null)

  const { 
    labelProps, 
    inputProps, 
    descriptionProps,  
  } = useTextField(props, input)

  const state = useOverlayTriggerState({})
  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type: 'dialog' },
    state,
    triggerRef
  )

  useEffect(() => props.onChange && props.onChange(values), [values.length])

  const add = value => {
    setValues([
      ...values,
      value
    ])
  }

  const remove = i => {
    setValues([
      ...values.slice(0, i),
      ...values.slice(i + 1)
    ])
  }

  const getDisabledKeys = () => (
    props.isAsync
      ? values.map(item => (item.value))
      : values
  )
  
  return(
    <div className="tf-multiple-combobox" data-enabled={ ! props.readOnly }>
      { props.label &&
        <Label labelProps={ labelProps } parent={ props }>
          { props.label }
        </Label> }
      <div className="tf-multiple-combobox-container">
        <div ref={ input } className="tf-multiple-combobox-values" { ...inputProps }>
          { values.length === 0
            ? props.placeholder ?? 'No item selected'
            : values.map(
              (value, i) => (
                <span key={ value.key ?? i } className="tf-combo-box-item">
                  <span>{ props.isAsync ? value.label : props.choices[value] ?? '' }</span>
                  { props.readOnly !== true && 
                    <Button onPress={ () => remove(i) }>x</Button> }
                </span>
              )
            ) }
        </div>
        <Button type="action" ref={ triggerRef } { ...triggerProps } isDisabled={ props.readOnly }>
          Add
        </Button>
        { state.isOpen && (
          <div className="tf-popover" ref={ overlayRef } { ...overlayProps }>
            <ComboBox
              focusStrategy={ 'first' }
              label={ 'Select an item to add' }
              labelVisuallyHidden={ true }
              description={ false }
              disabledKeys={ getDisabledKeys() }
              autoFocus={ true }
              multiple={ true }
              showButton={ false }
              menuTrigger="focus"
              onSelectionChange={ value => {
                if( ! value ) return;
                add(value)
                state.close()
              }}
              onFocusChange={ isFocus => isFocus 
                ? (! state.isOpen && state.open())
                : state.close() 
              }
              isAsync={ props.isAsync ?? false }
              { ...itemProps }
            >
              { props.children }
            </ComboBox>
            <DismissButton onDismiss={ state.close } />
          </div> ) }
      </div>
      { props.description &&
          <Description descriptionProps={ descriptionProps } parent={ props }>
            { props.description }
          </Description> }
  </div>
  )
}

export default MultipleComboBox
