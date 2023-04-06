import { 
  useRef, 
  useState, 
  useEffect 
} from 'react'

import { 
  VisuallyHidden,
  DismissButton,
  useOverlayTrigger,
  useTextField
} from 'react-aria'

import { useOverlayTriggerState } from 'react-stately'
import { uniqid } from '../../../utils'

import { 
  Button,
  Label,
  Description
 } from '../../base'

import { 
  Text,
  ComboBox
} from '../'

import { createInput } from '../../../codemirror/'

const editors = {} // CodeMirror instance (useRef instead?)

const DynamicText = props => {
  
  const [value, setValue] = useState(props.value ?? '')
  const [id, setID] = useState(uniqid())

  const input = useRef(null)
  const triggerRef = useRef(null)
  const overlayRef = useRef(null)

  const { 
    labelProps, 
    inputProps, 
    descriptionProps,  
  } = useTextField(props, input)

  useEffect(() => {
    editors[id] = createInput(
      input.current, 
      value, 
      setValue,
      props.choices
    )
  }, [])

  useEffect(() => props.onChange && props.onChange(value), [value])

  const state = useOverlayTriggerState({})
  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type: 'dialog' },
    state,
    triggerRef
  )
  
  /**
   * @see https://codemirror.net/examples/change/
   */
  const addDynamicElement = tag => {
    editors[id].dispatch({
      changes: {
        from: editors[id].state.doc.length, 
        insert: `[[${tag}]]`
      }
    })
  }
  
  return(
    <div class="tf-dynamic-text">
      { props.label &&
        <Label { ...labelProps }>
          { props.label }
        </Label> }
      <div class="tf-dynamic-text-field">
        <VisuallyHidden>
          <Text 
            label={ props.label ?? false } 
            name={ props.name ?? '' } 
            value={ value }
          />
        </VisuallyHidden>
        <div ref={ input } class="tf-dynamic-text-input" { ...inputProps }></div>
        <Button type="action" ref={ triggerRef } { ...triggerProps }>
          Add
        </Button>
        { state.isOpen && (
          <div class="tf-dynamic-text-popover" ref={ overlayRef } { ...overlayProps }>
            <ComboBox 
              choices={ props.choices ?? {} }
              autoFocus={ true }
              showButton={ false }
              onChange={ value => {
                if( ! value ) return;
                addDynamicElement(value)
                state.close()
              }}
              onFocusChange={ isFocus =>
                isFocus 
                  ? (! state.isOpen && state.open())
                  : state.close() 
              }
            /> 
            <DismissButton onDismiss={ state.close } />
          </div>
        ) }
      </div>
      { props.description &&
        <Description { ...descriptionProps }>
          { props.description }
        </Description> }
    </div>
  )
}

export default DynamicText

