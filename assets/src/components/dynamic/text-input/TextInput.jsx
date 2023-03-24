import { 
  useEffect,
  useRef,
  useState
} from 'react'

import { DynamicWrapper } from '..'
import { createInput } from '../../../codemirror/'

const TextInput = props => {

  const input = useRef()
  const editor = useRef()

  const [value, setValue] = useState(props.value ?? '')
  
  useEffect(() => {
    editor.current = createInput(
      input.current, 
      value, 
      setValue,
      props.choices
    )
  }, [])

 useEffect(() => props?.onChange(value), [value])

  /**
   * @see https://codemirror.net/examples/change/
   */
  const addDynamicValue = value => {
    editor.current.dispatch({
      changes: {
        from: editor.current.state.doc.length, 
        insert: `[[${value}]]`
      }
    })
  }

  return(
    <DynamicWrapper 
      config={ props.dynamic } 
      onValueSelection={ addDynamicValue }
    >
      <input { ...props } type="hidden" value={ value } />
      <div ref={ input } class="tf-dynamic-text-input"></div>
    </DynamicWrapper>
  )
}

export default TextInput
