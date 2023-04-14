import { render } from 'react-dom'
import { createContext } from 'react'
import { initContexts } from './contexts/'

import { 
  dispatchEvent,
  addEventListener 
} from './events'

import Control from './Control'

/**
 * Used to detect the current context from child components
 */
const ThemeContext = createContext(null)

const renderField = props => (
  <ThemeContext.Provider value={{
    name    : props.context ?? 'default',
    wrapper : `tf-context-${props.context ?? 'default'}`
  }}>
    <Control { ...props } />
  </ThemeContext.Provider>
)

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
  render       : renderField,
  event        : addEventListener,
  ThemeContext : ThemeContext
}

window.addEventListener('load', init)
