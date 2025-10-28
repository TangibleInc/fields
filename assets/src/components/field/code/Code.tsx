import {
  useRef,
  useEffect,
  useState
} from 'react'

import { useTextField } from 'react-aria'
import Editor from './Editor'

import {
  Description,
  Label
} from '../../base'

const Code = props => {

  const ref = useRef(null)

  const [value, setValue] = useState(props.value ?? '')
  const {
    labelProps,
    inputProps,
    descriptionProps,
  } = useTextField(props, ref)

  useEffect(() => {
    if( props.onChange ) props.onChange(value)
  }, [value])

  return <div className="tf-code">
    { props.label &&
      <Label labelProps={ labelProps } parent={ props }>
        { props.label }
      </Label> }
    <input
      { ...inputProps }
      type="hidden"
      value={ value }
      ref={ ref }
      name={ props.name ?? '' }
    />
    <Editor
      { ...props }
      value={ value }
      onChange={ setValue }
    />
    { props.description &&
      <Description descriptionProps={ descriptionProps } parent={ props }>
        { props.description }
      </Description> }
  </div>
}

export default Code
