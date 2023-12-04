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
import store from './store'
import types from './types'
import fields from './fields'
import * as utils from './utils'

/**
 * Used to detect the current context from child components
 */
const ControlContext = createContext(null)

const renderField = props => (
  <ControlContext.Provider value={{
    name     : props.context ?? 'default',
    wrapper  : `tf-context-${props.context ?? 'default'}`,
    getValue : store.getValue.bind(store) 
  }}>
    <Control 
      { ...props } 
      onChange={ value => {
        store._setValueFromControl(props.name, value)
        if( props.onChange ) props.onChange(value)
      }}
      visibility={{
        condition: props.condition?.condition ?? false,
        action: props.condition?.action ?? 'show',
      }}
      data={{
        getValue: store.getValue.bind(store)
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
      : render(component, element)

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
  trigger        : triggerEvent,
  store          : store,
  types          : types,
  utils          : utils,
  fields         : fields,
  ControlContext : ControlContext
}

window.addEventListener('load', init)
