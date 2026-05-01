import {
  useEffect,
  useRef,
  useState
} from 'react'

import { useTextField } from 'react-aria'
import ProseMirror from './ProseMirror'

import {
  Label,
  Description
} from '../../../base'

import { BaseWrapper } from '../../../dynamic/'

const Editor = props => {

  const [value, setValue] = useState(props.value)
  const editorRef = useRef(null)

  const {
    labelProps,
    inputProps,
    descriptionProps,
  } = useTextField(props, editorRef)

  useEffect(() => {
    props.onChange && props.onChange(value)
  }, [value])

  const insertDynamicValue = token => setValue(prev => (prev ?? '') + token)

  return (
    <div className="tf-editor">
      { props.label &&
        <Label labelProps={ labelProps } parent={ props }>
          { props.label }
        </Label> }
      <BaseWrapper
        config={ props.dynamic ?? false }
        onValueSelection={ insertDynamicValue }
        buttonType="outside"
      >
        <input { ...inputProps } type="hidden" name={ props.name } value={ value } />
        <ProseMirror
          ref={ editorRef }
          value={ value }
          onChange={ setValue }
          rawView={ props.rawView ?? true }
        />
      </BaseWrapper>
      { props.description &&
        <Description descriptionProps={ descriptionProps } parent={ props }>
          { props.description }
        </Description> }
    </div>
  )

}

export default Editor
