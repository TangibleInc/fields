import { render } from 'react-dom'
import { OverlayProvider } from 'react-aria'
import { initContexts } from './contexts/'

import { 
  dispatchEvent,
  addEventListener 
} from './events'

import Control from './Control'

const renderField = props => {
  const wrapper = props.wrapper ?? {}

  return (
      <Control  { ...props } {...wrapper}/>
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

  initContexts()
}

/**
 * Make tangibleFields accessible from other scripts
 */
window.tangibleFields = {
  render : renderField,
  event  : addEventListener
}

window.addEventListener('load', init)
