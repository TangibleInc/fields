import { 
  useEffect,
  useRef, 
  useState
} from 'react'

import { useTextField } from 'react-aria'

import { 
  Label, 
  Description 
} from '../../base'

const Editor = props => {

  const ref = useRef()

  const { 
    labelProps, 
    inputProps, 
    descriptionProps, 
  } = useTextField(props, ref)

  const [value, setValue] = useState(props.value)

  useEffect(() => {
    tinyMCE.init({
      target: ref.current,
      // Customize editor options: https://www.tiny.cloud/docs/general-configuration-guide/basic-setup/
      setup: function(editor){
        editor.on('input', () => setValue(editor.getContent()))
        editor.on('ExecCommand', () => setValue(editor.getContent()))
      }
    })
  }, [])

  useEffect(() => props.onChange && props.onChange(value), [value])

  return(
    <div class="tf-editor">
      { props.label &&
        <Label { ...labelProps }>
          { props.label }
        </Label> }
      <textarea ref={ ref } { ...inputProps }>{ value }</textarea>
      { props.description &&
        <Description { ...descriptionProps }>
          { props.description }
        </Description> }
    </div>
  )
}

export default Editor
