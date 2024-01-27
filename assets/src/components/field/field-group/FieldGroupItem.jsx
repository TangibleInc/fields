import Control from '../../../Control'
import Element from '../../../Element'
import types from '../../../types'

const FieldGroupItem = ({
  config,
  values,
  onChange,
  data
}) => {

  const elements = Object.keys(types._types.element)
  const isElement = elements.includes(config.type ?? '')

  const Component = isElement ? Element : Control
  const controlProps = ! isElement
    ? {
      value    : values[ config.name ] ?? '',
      onChange : onChange
    } : {}
  
  return(
    <Component
      itemType={ isElement ? 'subelement' : 'subfield' }
      visibility={{
        action    : config.condition?.action ?? 'show',
        condition : config.condition?.condition ?? false
      }}
      data={ data }
      { ...controlProps }
      { ...config }
    />
  )
}

export default FieldGroupItem
