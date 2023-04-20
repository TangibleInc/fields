import { 
  render, 
  createRoot 
} from 'react-dom'

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
const values = {}

const renderField = props => (
  <ThemeContext.Provider value={{
    name    : props.context ?? 'default',
    wrapper : `tf-context-${props.context ?? 'default'}`
  }}>
    <Control { ...props } onChange={ value => values[props.name] = value } />
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

    const component = renderField({ 
      name: field, 
      ...props 
    })

    /**
     * React 18 is used since WP 6.2 (createRoot() need to be used instead of render())
     */
    createRoot
      ? createRoot(element).render(component)
      : render(element, component)

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
  values       : values,
  ThemeContext : ThemeContext
}

window.addEventListener('load', init)
