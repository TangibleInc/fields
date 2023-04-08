import { 
  useReducer, 
  useEffect 
} from 'react'

import controls from './controls-list.js'

import { controlDispatcher } from './dispatcher.js'
import { triggerEvent } from './events'
import { format } from './format'
import { dynamicValuesAPI } from './dynamic-values'

const Control = props => {
  
  /**
   * Each field value use a JSON structure, handled by this dispatcher
   * 
   * @see dispatcher.js
   * @see format.js
   */
  const [data, dispatch] = useReducer(
    controlDispatcher, 
    format(
      props.value ?? '', 
      props.default ?? ''
    )
  )

  useEffect(() => props.onChange && props.onChange(data), [data.value])
  useEffect(() => props.onChange && props.onChange(data), [data?.dynamicValues?.values])
  
  const type = props.type ?? 'text'
  const ControlComponent = controls[ type ] ?? false
  
  if( ! ControlComponent ) return <></>;

  const childProps = Object.assign({}, props)
  
  delete childProps.value
  delete childProps.onChange
  delete childProps.name
  
  const onChange = newValue => {

    triggerEvent('valueChange', {
      name      : props.name ?? false, 
      props     : props,
      value     : newValue,
    })

    dispatch({
      type: 'updateValue',
      value: newValue
    })
  }

  return(
    <>
      <input type="hidden" name={ props.name ?? '' } value={ JSON.stringify(data) } />
      <ControlComponent
        { ...childProps }
        value={ data.value }
        onChange={ onChange } 
        dynamic={ props.dynamic 
          ? dynamicValuesAPI(data, dispatch) 
          : false 
        } 
      />
    </>
  )
}

export default Control
