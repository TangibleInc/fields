import { render } from 'react-dom'
import { createContext } from 'react'
import { OverlayProvider } from 'react-aria'
import { initContexts } from './contexts/'

import { 
  triggerEvent,
  addEventListener 
} from './events'

import Control from './Control'

/**
 * Used to detect the current context from child components
 */
const ThemeContext = createContext(null)

const renderField = props => {
  
  const wrapper = props.wrapper ?? {}
  const wrapperClass = wrapper.class ?? ''
  const themeWrapper = `tf-context-${props.context ?? 'default'}`

  delete props.wrapper
  delete wrapper.class

  return (
    <ThemeContext.Provider value={{
      name    : props.context ?? 'default',
      wrapper : themeWrapper
    }}>
      <OverlayProvider { ...wrapper } className={ `${themeWrapper} ${wrapperClass}` }>
        <Control { ...props } />
      </OverlayProvider>
    </ThemeContext.Provider>
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

    triggerEvent('initField', {
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
