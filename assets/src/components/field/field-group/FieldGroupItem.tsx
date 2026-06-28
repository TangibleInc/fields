import Control from '../../../Control'
import Element from '../../../Element'
import store from '../../../store'
import types from '../../../types'

const FieldGroupItem = ({
  config,
  values,
  onChange,
  data,
  uncontrolled
}) => {

  const elements = Object.keys(types._types.element)
  const isElement = elements.includes(config.type ?? '')

  const Component = isElement ? Element : Control

  /**
   * Element      : No value, purely UI component
   * Uncontrolled : We handle the value like a regular field (no FieldGroup value)
   * Controlled   : Value is stored in the parent component, alongside other subfields
   */
  const controlProps = isElement
    ? {}
    : (uncontrolled
      ? { onChange: value => store._setValueFromControl(config.name, value) }
      : { value: values[ config.name ] ?? '', onChange })

  return(
    <Component
      itemType={ uncontrolled
        ? (isElement ? 'element' : 'field')
        : (isElement ? 'subelement' : 'subfield')
      }
      visibility={{
        action    : config.condition?.action ?? 'show',
        condition : config.condition?.condition ?? false
      }}
      data={ data }
      { ...config }
      { ...controlProps }
    />
  )
}

export default FieldGroupItem
