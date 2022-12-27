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

  const [values, setValues] = useState(
    props.value && Array.isArray(props.value)
      ? props.value
      : (props.value ? props.value.split(',') : [])
  )

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

  if( props.onChange ) {
    useEffect(() => props.onChange(values), [values.length])
  }

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
  
  return(
    <div class="tf-multiple-combobox">
      { props.label &&
        <Label { ...labelProps }>
          { props.label }
        </Label> }
      <div class="tf-combo-box-container">
        <div ref={ input } class="tf-combo-box-values" { ...inputProps }>
          { values.length === 0
            ? props.placeholder ?? 'No item selected'
            : values.map(
              (value, i) => (
                <span class="tf-combo-box-item">
                  <span>{ props.choices[value] ?? '' }</span>
                  <Button onPress={ () => remove(i) }>x</Button>
                </span>
              )
            ) }
        </div>
        <Button type="action" ref={ triggerRef } { ...triggerProps }>
          Add
        </Button>
      </div>
      { state.isOpen && (
        <div class="tf-popover" ref={ overlayRef } { ...overlayProps }>
          <ComboBox
            focusStrategy={ 'first' }
            label={ false }
            description={ false }
            disabledKeys={ values }
            autoFocus={ true }
            defaultItems={ getOptions(props.choices ?? {}) }
            onSelectionChange={ value => {
              add(value)
              state.close()
            }}
            onFocusChange={ isFocus => isFocus 
              ? (! state.isOpen && state.open())
              : state.close() 
            }
          >
            { props.children }
          </ComboBox>
          <DismissButton onDismiss={ state.close } />
        </div> ) }
      { props.description &&
        <Description { ...descriptionProps }>
          { props.description }
        </Description> }
  </div>
  )
}

export default MultipleComboBox
