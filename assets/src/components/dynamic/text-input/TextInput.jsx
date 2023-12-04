import { 
  useEffect,
  useRef,
  useState,
  forwardRef
} from 'react'

import { createInput } from '../../../codemirror/'
import { BaseWrapper, FieldWrapper } from '..'

const TextInput = forwardRef(({
  inputProps,
  ...props
}, ref) => {

  const editor = useRef()
  const [value, setValue] = useState(props.value ?? '')

  useEffect(() => {
    editor.current = editor.current ?? createInput(
      ref.current,
      value, 
      setValue,
      props.choices,
      getDynamicValueLabel,
      { readOnly: props.readOnly ?? false }
    )
  }, [ref.current])

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
  const insertDynamicValue = value => {
    editor.current.dispatch({
      changes: {
        from: editor.current.state.doc.length, 
        insert: `${value}`
      }
    })
  }

  /**
   * Text field type support 2 mode for dynamic values
   * - Insert - Allow to add multiple dynamic values and text as the value 
   * - Replace - Only one dynamic value that fully replace the previous field value (no regular text) 
   */

  if( props.dynamic && props.dynamic.getMode() === 'replace' ) {
    return(
      <FieldWrapper
        { ...props }
        config={ props.dynamic ?? '' } 
        value={ value }
        onValueSelection={ setValue }
        onValueRemove={ () => {
          // editor.current need to be re-init + re-render because ref.current changed
          editor.current = null
          setValue('')
        }}
        inputProps={ inputProps }
      >
        <input { ...inputProps } type="hidden" value={ value }/>
        <div ref={ ref } className="tf-dynamic-text-input"></div>
      </FieldWrapper> 
    )
  }
  
  return(
    <BaseWrapper
      config={ props.dynamic ?? '' } 
      onValueSelection={ insertDynamicValue }
    >
      <input { ...inputProps } type="hidden" value={ value }/>
      <div ref={ ref } className="tf-dynamic-text-input"></div>
    </BaseWrapper>
  )
})

export default TextInput
