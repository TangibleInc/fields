import { 
  useRef, 
  useState, 
  useEffect 
} from 'react'

import { 
  VisuallyHidden,
  DismissButton,
  useOverlayTrigger
} from 'react-aria'

import { useOverlayTriggerState } from 'react-stately'

import { uniqid } from '../../../utils'
import { Button } from '../../base'

import { 
  Text,
  ComboBox
} from '../'

import createInput from './codemirror'

const editors = {} // CodeMirror instance

const DynamicText = props => {
  
  const [value, setValue] = useState(props.value ?? '')
  const [id, setID] = useState(uniqid())
  
  const input = useRef(null)
  const triggerRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    editors[id] = createInput(input.current, value, setValue)
  }, [])

  if( props.onChange ) {
    useEffect(() => props.onChange(value), [value])
  }

  const state =  useOverlayTriggerState({})
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
      <VisuallyHidden>
        <Text 
          label={ props.label ?? false } 
          name={ props.name ?? '' } 
          value={ value }
          onChange={ value => console.log(value) }
        />
      </VisuallyHidden>
      <div ref={ input } class="tf-dynamic-text-input"></div>
      <Button type="action" ref={ triggerRef } { ...triggerProps }>
        Add
      </Button>
      { state.isOpen && (
        <div class="tf-dynamic-text-popover" ref={ overlayRef } { ...overlayProps }>
          <ComboBox 
            items={ props.items }
            onChange={ value => {
              if( value === null ) return;
              addDynamicElement(value)
              state.close()
            }}
            onFocusChange={ isFocus =>
              isFocus 
                ? ! state.isOpen && state.open() 
                : state.close() 
            }
          /> 
          <DismissButton onDismiss={ state.close } />
        </div>
      ) }
    </div>
  )
}

export default DynamicText

