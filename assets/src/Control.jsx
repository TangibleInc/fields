import { 
  useState, 
  useEffect 
} from 'react'

import controls from './controls-list.js'

import { dispatchEvent } from './events'
import { format } from './format'

const Control = props => {

  const [data, setData] = useState(
    format(props.value ?? '')
  )

  useEffect(() => props.onChange && props.onChange(data), [data.value])
  
  const type = props.type ?? 'text'
  const ControlComponent = controls[ type ] ?? false
  
  if( ! ControlComponent ) return <></>;

  const childProps = Object.assign({}, props)
  
  delete childProps.value
  delete childProps.onChange
  delete childProps.name
  
  const onChange = newValue => {

    dispatchEvent('valueChange', {
      name      : props.name ?? false, 
      props     : props,
      value     : newValue,
    })

    setData({
      ...data,
      value: newValue
    })
  }

  /**
   * TODO: dispatcher
   */
  const getDynamicConfig = () => ({
    types: props.dynamic,
    hasDynamicValues: () => (Object.keys(data.dynamicValues).length !== 0),
    get: () => (data.dynamicValues ?? {}),
    delete: key => delete data.dynamicValues[ key ],
    clear: () => {
      setData({ ...data, dynamicValues: {}})
    },
    add: (id, settings) => (
      setData({
        ...data,
        dynamicValues: {
          ...data.dynamicValues,
          [id]: settings
        }
      })
    )
  })

  return(
    <>
      <input type="hidden" name={ props.name ?? '' } value={ JSON.stringify(data) } />
      <ControlComponent
        { ...childProps }
        value={ data.value }
        onChange={ onChange } 
        dynamic={ props.dynamic ? getDynamicConfig() : false } 
      />
    </>
  )
}

export default Control
