import { 
  useEffect,
  useRef,
  useState
} from 'react'

import { 
  createInput,
  getDynamicTokens 
} from '../../../codemirror/'

import { BaseWrapper } from '..'

const TextInput = props => {

  const input = useRef()
  const editor = useRef()

  const [value, setValue] = useState(props.value ?? '')
  
  useEffect(() => {
    editor.current = createInput(
      input.current, 
      value, 
      updateValue,
      props.choices,
      getDynamicValueLabel
    )
  }, [])

  const getDynamicValueLabel = slug => (
    props.dynamic 
      ? (props.dynamic.getAll()[ slug ]?.name ?? slug)
      : slug 
  )

  const updateValue = value => {
     
    setValue(value)
    
    if( ! props.dynamic ) return;

    /**
     * We check if saved dynamic values still exists, and if not we delete them
     * 
     * Note: There might be a better to handle this thought a codemirror event but
     * didn't find documentation about it and we will switch to prosemirror soon so not 
     * worth looking into it
     */
    const dynamicValues = getDynamicTokens(value) 
    const savedDynamicValues = props.dynamic.getAll()

    for( const key in savedDynamicValues ) {
      
      if( ! dynamicValues.includes(key) ) {
        props.dynamic.delete(key)
      }
    }
  }

  useEffect(() => props?.onChange(value), [value])

  /**
   * @see https://codemirror.net/examples/change/
   */
  const addDynamicValue = (value) => {
    
    props.dynamic.setMode('insert')

    editor.current.dispatch({
      changes: {
        from: editor.current.state.doc.length, 
        insert: `[[${value}]]`
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
