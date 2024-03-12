import { 
  useEffect,
  useRef,
  useState,
  forwardRef
} from 'react'

import { createInput, matchesMask } from '../../../codemirror/'
import { BaseWrapper, FieldWrapper } from '..'

const TextInput = forwardRef(({
  inputProps,
  ...props
}, ref) => {

  const editor = useRef()

  let initialValue = props.value ?? ''
  if ( props.prefix || props.suffix ) {
    if ( props.prefix && !initialValue.startsWith(props.prefix) ) initialValue = props.prefix + initialValue
    if ( props.suffix && !initialValue.endsWith(props.suffix) ) initialValue = initialValue + props.suffix
  }
  if ( props.inputMask ) initialValue = matchesMask( initialValue, props.inputMask ) ? initialValue : ''
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    let editorValue = value
    if ( props.prefix ) editorValue = editorValue.slice(props.prefix.length)
    if ( props.suffix ) editorValue = editorValue.slice(0, editorValue.length - props.suffix.length)

    editor.current = editor.current ?? createInput(
      ref.current,
      editorValue,
      value => { setValue( `${props.prefix??''}${value}${props.suffix??''}` ) },
      props.choices,
      getDynamicValueLabel,
      {
        readOnly: props.readOnly ?? false,
        inputMask: props.inputMask && props.inputMask !== '' ? props.inputMask : null
      }
    )
  }, [ref.current])

  useEffect(() => {
    if ( props.suffix ) {
      const suffix = document.createElement('span');
      suffix.textContent = props.suffix;
      suffix.setAttribute( 'class', 'tf-dynamic-text-input__affix tf-dynamic-text-input__affix--suffix' )
      ref.current.appendChild(suffix);
    }
    if ( props.prefix ) {
      const prefix = document.createElement('span');
      prefix.textContent = props.prefix;
      prefix.setAttribute( 'class', 'tf-dynamic-text-input__affix tf-dynamic-text-input__affix--prefix' )
      ref.current.insertBefore(prefix, ref.current.children[0]);
    }
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

  if( !props.inputMask && props.dynamic && props.dynamic.getMode() === 'replace' ) {
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
        readOnly={ props.readOnly ?? false }
        buttonType={ 'inside' }
      >
        <input { ...inputProps } type="hidden" value={ value }/>
        <div
          ref={ ref }
          className={`tf-dynamic-text-input${ props.prefix ? ' tf-dynamic-text-input--has-prefix' : '' }${ props.suffix ? ' tf-dynamic-text-input--has-suffix' : '' }`}
        />
      </FieldWrapper> 
    )
  }

  return(
    <BaseWrapper
      config={ props.dynamic ?? '' }
      onValueSelection={ insertDynamicValue }
      buttonType={ 'inside' }
      readOnly={ props.readOnly ?? false }
      inputMasking={ props.inputMask }
    >
      <input { ...inputProps } type="hidden" value={ value }/>
      <div
        ref={ ref }
        className={`tf-dynamic-text-input${ props.prefix ? ' tf-dynamic-text-input--has-prefix' : '' }${ props.suffix ? ' tf-dynamic-text-input--has-suffix' : '' }`}
      />
    </BaseWrapper>
  )
})

export default TextInput
