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

const TinyMce = props => {

  const ref = useRef()

  const {
    labelProps,
    inputProps,
    descriptionProps,
  } = useTextField(props, ref)

  const [value, setValue] = useState(props.value)

  useEffect(() => {
    // Update local state when props.value changes
    setValue(props.value)
  }, [props.value])

  useEffect(() => {

    /**
     * Calling tinyMCE.init directly can fail in some cases, wrapping it
     * inside a setTimeout seems to fix the issue
     */
    setTimeout(() => {
      tinyMCE.init({
        target: ref.current,
        // Customize editor options: https://www.tiny.cloud/docs/general-configuration-guide/basic-setup/
        setup: function (editor) {
          editor.on('input', () => setValue(editor.getContent()))
        }
      })
    })

  }, [])

  useEffect(() => props.onChange && props.onChange(value), [value])

  return (
    <div className="tf-editor">
      {props.label &&
        <Label labelProps={ labelProps } parent={ props }>
          {props.label}
        </Label>}
      <textarea ref={ref} {...inputProps}>{value}</textarea>
      { props.description &&
        <Description descriptionProps={ descriptionProps } parent={ props }>
          { props.description }
        </Description>}
    </div>
  )
}

export default TinyMce;
