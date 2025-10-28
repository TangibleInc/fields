import { 
  render, 
  createRoot 
} from 'react-dom'

import { createContext } from 'react'

import {
  config,
  getConfig,
  setConfig
} from './config'

import { 
  triggerEvent,
  addEventListener 
} from './events'

import Control from './Control'
import Element from './Element'
import store from './store'
import types from './types'
import fields from './fields'
import * as utils from './utils'

/**
 * Used to detect the current context from child components
 */
const ControlContext = createContext(null)

const renderComponent = (props, type = 'field') => (
  type === 'element' 
    ? renderElement(props)
    : renderField(props)
)

const renderField = props => (
  <ControlContext.Provider value={{
    name            : props.context ?? 'default',
    wrapper         : `tf-context-${props.context ?? 'default'}`,
    getValue        : store.getValue.bind(store),
    portalContainer : props.portalContainer ?? document.body
  }}>
    <Control 
      { ...props } 
      onChange={ value => {
        store._setValueFromControl(props.name, value)
        if( props.onChange ) props.onChange(value)
      }}
      visibility={{
        condition : props.condition?.condition ?? false,
        action    : props.condition?.action ?? 'show',
      }}
      data={{
        getValue: store.getValue.bind(store)
      }}
    />
  </ControlContext.Provider>
)

const renderElement = props => (
  <ControlContext.Provider value={{
    name            : props.context ?? 'default',
    wrapper         : `tf-context-${props.context ?? 'default'}`,
    getValue        : store.getValue.bind(store),
    portalContainer : props.portalContainer ?? document.body
  }}>
    <Element 
      { ...props } 
      onChange={ value => {
        store._setValueFromControl(props.name, value)
        if( props.onChange ) props.onChange(value)
      }}
      visibility={{
        condition : props.condition?.condition ?? false,
        action    : props.condition?.action ?? 'show',
      }}
      data={{
        getValue: store.getValue.bind(store)
      }}
    />
  </ControlContext.Provider>
)

/**
 * Render fields and elements registered from PHP
 */
const init = () => {

  const { fields, elements } = getConfig() // Previously window.TangibleFields
  const items = []

  for( const field in fields ) {
    items.push( initItem(field, fields[ field ], 'fields') )
  }

  for( const element in elements ) {
    elements[ element ].forEach(instance => {
      items.push( initItem(element, instance, 'elements') )
    })
  }

  /**
   * After all fields and elements are initialized
   */
  Promise.all(items).then(() => triggerEvent('ready', {}))
}

const initItem = (name, props, type) => (
  new Promise(resolve => {

    const element = document.getElementById(props.element)

    if( ! element ) return resolve();

    const afterInitialization = () => {
      resolve()
      triggerEvent(
        type === 'fields' ? 'initField' : 'initElement', 
        { name, props }
      )
    }

    const component = type === 'fields' 
      ? renderField({ name, afterInitialization, ...props })
      : renderElement({ name, afterInitialization, ...props })

    /**
     * React 18 is used since WP 6.2 (createRoot() need to be used instead of render())
     */
    createRoot
      ? createRoot(element).render(component)
      : render(component, element)
  })
)

export {
  renderComponent as render,
  addEventListener as event,
  triggerEvent as trigger,
  store,
  types,
  utils,
  fields,
  ControlContext,
  init,
  config,
  getConfig,
  setConfig
}
