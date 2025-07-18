import { OverlayProvider } from 'react-aria'
import { 
  useContext,
  useEffect
} from 'react'
import { ControlContext } from './index.jsx'

import types from './types.js'
import DependendWrapper from './components/dependent/DependendWrapper'
import VisibilityWrapper from './components/visibility/VisibilityWrapper'
import RenderWrapper from './components/render/RenderWrapper.jsx'

/**
 * Really similar to Control component, expect it has no values
 */
const Element = ({
  visibility,
  data,
  afterInitialization = false,
  ...props
}) => {

  /**
   * @see renderElement() in ./src/index.jsx 
   */
  const control = useContext(ControlContext)

  const wrapper = {
    ...(props.wrapper ?? {}),
    className: `${props?.wrapper?.class ?? ''} ${control.wrapper}`
  }
  delete wrapper.class
  
  useEffect(() => {
    if ( afterInitialization ) afterInitialization() // Not set for subfields
  }, [])

  const ElementComponent = types.get(props.type ?? false, 'element')
  if (!ElementComponent) return <></>;

  return (
    <OverlayProvider { ...wrapper }>
      <VisibilityWrapper visibility={ visibility } data={ data }>
        <RenderWrapper 
          itemType={ props.itemType ?? 'field' }
          name={ props.name ?? false } 
        >
        { refreshRender => 
          <DependendWrapper 
            refresh={ refreshRender } 
            data={ data } 
            itemProps={ props } 
          >
          { itemProps => <ElementComponent { ...itemProps } data={ data } /> }
          </DependendWrapper> }
        </RenderWrapper>
      </VisibilityWrapper>
    </OverlayProvider>
  )
}

export default Element
