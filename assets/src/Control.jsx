import {
  useEffect,
  useState,
  useContext
} from 'react'
import { ControlContext } from './index.jsx'

import { triggerEvent } from './events'
import { OverlayProvider } from 'react-aria'
import { dynamicValuesAPI } from './dynamic-values'

import types from './types.js'
import DependendWrapper from './components/dependent/DependendWrapper'
import RenderWrapper from './components/render/RenderWrapper'
import VisibilityWrapper from './components/visibility/VisibilityWrapper'

const Control = ({
  visibility,
  data,
  afterInitialization = false,
  ...props
}) => {

  /**
   * @see renderField() in ./src/index.jsx
   */
  const control = useContext(ControlContext)

  const wrapper = {
    ...(props.wrapper ?? {}),
    className: `${props?.wrapper?.class ?? ''} ${control.wrapper}`
  }
  delete wrapper.class

  const [value, setValue] = useState(props.value ?? '')

  useEffect(() => {
    props.onChange && props.onChange(value)
  }, [value])

  const ControlComponent = types.get(props.type ?? 'text')

  useEffect(() => {
    if ( afterInitialization ) afterInitialization() // Not set for subfields
  }, [])
  
  if (!ControlComponent) return <></>;

  const onChange = newValue => {

    setValue(newValue)

    // The timeout make sure the event is dispatched after the state changed
    setTimeout(() => {
      triggerEvent('valueChange', {
        name          : props.name ?? false,
        props         : props,
        value         : newValue,
        previousValue : value
      })
    })
  }

  return (
    <OverlayProvider { ...wrapper }>
      <VisibilityWrapper visibility={ visibility } data={ data }>
        <RenderWrapper
          itemType={ props.itemType ?? 'field' }
          name={ props.name ?? false }
          setValue={ setValue }
        >
        { refreshRender =>
          <DependendWrapper
            refresh={ refreshRender }
            data={ data }
            itemProps={ props }
          >
          { itemProps =>
            <ControlComponent
              { ...itemProps }
              value={ value }
              onChange={ onChange }
              data={ data }
              dynamic={ props.dynamic
                ? dynamicValuesAPI(value, setValue, props)
                : false
              }
            /> }
          </DependendWrapper> }
        </RenderWrapper>
      </VisibilityWrapper>
    </OverlayProvider>
  )
}

export default Control
