import { render } from 'react-dom'
import { OverlayProvider } from 'react-aria'

import { 
  dispatchEvent,
  addEventListener 
} from './events'

import Control from './Control'

const renderField = props => {
  const wrapper = props.wrapper ?? {}
  const wrapperClass = wrapper.class ?? ''

  delete props.wrapper
  delete wrapper.class

  return (
    <OverlayProvider { ...wrapper } className={ `tf-context-${props.context ?? 'default'} ${wrapperClass}` }>
      <Control { ...props } />
    </OverlayProvider> 
  )
}

/**
 * Render fields registered from PHP
 */
const init = () => {

  const { fields } = TangibleFields

  for( const field in fields ) {

    const props = fields[ field ]
    const element = document.getElementById(props.element)

    if( ! element ) continue;

    render(
      renderField({ 
        name: field, 
        ...props 
      })
    , element)

    dispatchEvent('initField', {
      name  : field, 
      props : props
    })
  }

}

/**
 * Make tangibleFields accessible from other scripts
 */
window.tangibleFields = {
  render : renderField,
  event  : addEventListener
}

window.addEventListener('load', init)
