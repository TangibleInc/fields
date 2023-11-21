import { 
  useEffect,
  useRef,
  useState,
  forwardRef
} from 'react'

import { createInput } from '../../../codemirror/'
import { BaseWrapper } from '..'

const TextInput = forwardRef(({
  inputProps,
  ...props
}, ref) => {

  const editor = useRef()

  const [value, setValue] = useState(props.value ?? '')

  useEffect(() => {
    editor.current = createInput(
      ref.current, 
      value, 
      setValue,
      props.choices,
      getDynamicValueLabel,
      { readOnly: props.readOnly ?? false }
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
      config={ props.dynamic ?? 'test' } 
      onValueSelection={ addDynamicValue }
    >
      <input { ...inputProps } type="hidden" value={ value }/>
      <div ref={ ref } className="tf-dynamic-text-input"></div>
    </BaseWrapper>
  )
})

export default TextInput
