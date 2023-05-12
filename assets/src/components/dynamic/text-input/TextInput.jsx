import { 
  useEffect,
  useRef,
  useState
} from 'react'

import { createInput } from '../../../codemirror/'
import { BaseWrapper } from '..'

const TextInput = props => {

  const input = useRef()
  const editor = useRef()

  const [value, setValue] = useState(props.value ?? '')
  
  useEffect(() => {
    editor.current = createInput(
      input.current, 
      value, 
      setValue,
      props.choices,
      getDynamicValueLabel
    )
  }, [])

  const getDynamicValueLabel = string => {
    const value = props.dynamic.parse(string)
    return value && value.type 
      ? props.dynamic.getLabel(value.type)
      : string
  }

  useEffect(() => props.onChange && props.onChange(value), [value])

  /**
   * @see https://codemirror.net/examples/change/
   */
  const addDynamicValue = (value) => {
    editor.current.dispatch({
      changes: {
        from: editor.current.state.doc.length, 
        insert: `${value}`
      }
    })
  }
  
  return(
    <BaseWrapper
      config={ props.dynamic ?? false } 
      onValueSelection={ addDynamicValue }
      actions={ ['insert'] }
    >
      <input { ...props } type="hidden" value={ value } />
      <div ref={ input } class="tf-dynamic-text-input"></div>
    </BaseWrapper>
  )
}

export default TextInput
