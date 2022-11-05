import { 
  useRef, 
  useState, 
  useEffect 
} from 'react'

import {  
  DialogTrigger, 
  ActionButton,
  Dialog,
  ComboBox,
  Item,
  Section
} from '@adobe/react-spectrum'

import { VisuallyHidden } from 'react-aria'
import { uniqid } from '../../../utils'

import { Text } from '../'

import createInput from './codemirror'

const editors = {} // CodeMirror instance

const DynamicText = props => {
  
  const [value, setValue] = useState(props.value ?? '')
  const [id, setID] = useState(uniqid())
 
  const input = useRef(null)
    
  useEffect(() => {
    editors[id] = createInput(input.current, value, setValue)
  }, [])

  if( props.onChange ) {
    useEffect(() => props.onChange(value), [value])
  }
  
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
      <DialogTrigger 
        type="popover" 
        placement="bottom right"
        hideArrow={ true }
      >
        <ActionButton>Add</ActionButton>
        { close => (
          <Dialog minWidth={ 200 } minHeight={ 0 } width={ 'auto' } height={ 0 }>
            <ComboBox 
              minWidth={ 200 } 
              width={ '100%' } 
              defaultItems={ props.suggestion ?? [] }
              onSelectionChange={ id => {
                addDynamicElement(id)
                close()
              }}
            >
              { item => (
                <Section key={ item.name } items={ item.children } title={ item.name }>
                  { item => <Item key={ item.name }>{ item.name }</Item> }
                </Section>
              ) }
            </ComboBox>
          </Dialog>
        )}
      </DialogTrigger>
    </div>
  )
}

const span = {
  border: '1px solid #8c8f94',
  padding: 5
}

export default DynamicText

