import {
  useState,
  useEffect,
  useContext
} from 'react'

import { OverlayProvider } from 'react-aria'
import controls from './controls-list.js'
import { dispatchEvent } from './events'

const Control = props => {
  
  /**
   * It needs to be added again in order to correctly apply style inside the modal
   * 
   * @see renderField() in ./src/index.jsx 
   */
  const { ThemeContext } = tangibleFields 
  const theme = useContext(ThemeContext)
  
  const wrapper = {
    ...(props.wrapper ?? {}),
    class: `${props?.wrapper?.class ?? ''} ${theme.wrapper}`
  }

  const [value, setValue] = useState(props.value ?? '')

  useEffect(() => props.onChange && props.onChange(value), [value])

  const type = props.type ?? 'text'
  const ControlComponent = controls[type] ?? false

  if (!ControlComponent) return <></>;

  const childProps = Object.assign({}, props)

  delete childProps.value
  delete childProps.onChange

  delete childProps.class
  delete childProps.wrapper

  const onChange = newValue => {

    dispatchEvent('valueChange', {
      name: props.name ?? false,
      props: props,
      value: newValue,
    })

    setValue(newValue)
  }

  return (
    <OverlayProvider { ...wrapper }>
      <ControlComponent value={value} onChange={onChange} { ...childProps } />
    </OverlayProvider>
  )
}

export default Control
