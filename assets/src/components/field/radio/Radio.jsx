import {
  useContext,
  useRef
} from 'react'

import { RadioContext } from './RadioGroup'
import { useRadio } from 'react-aria'

const Radio = props => {

  const state = useContext(RadioContext)
  const ref = useRef(null)

  const { inputProps } = useRadio(props, state, ref)

  return (
    <label class="tf-radio">
      <input {...inputProps} ref={ref} />
      {props.children}
    </label>
  )
}

export default Radio
