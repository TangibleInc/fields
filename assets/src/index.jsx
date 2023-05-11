import { 
  render, 
  createRoot 
} from 'react-dom'

import { createContext } from 'react'
import { initContexts } from './contexts/'

import { 
  triggerEvent,
  addEventListener 
} from './events'

import Control from './Control'

/**
 * Used to detect the current context from child components
 */
const ControlContext = createContext(null)
const values = {}

const renderField = props => (
  <ControlContext.Provider value={{
    name     : props.context ?? 'default',
    wrapper  : `tf-context-${props.context ?? 'default'}`,
    getValue : name => values[name] ?? '' 
  }}>
    <Control 
      { ...props } 
      onChange={ value => {
        values[props.name] = value
        if( props.onChange ) props.onChange(value)
      }}
      visibility={{
        condition: props.condition?.condition ?? false,
        action: props.condition?.action ?? 'show',
      }}
    />
  </ControlContext.Provider>
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
  render         : renderField,
  event          : addEventListener,
  values         : values,
  ControlContext : ControlContext
}

window.addEventListener('load', init)
