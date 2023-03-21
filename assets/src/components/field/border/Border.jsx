import { useState, useEffect } from 'react'
import { useField } from 'react-aria'

import { Label, Description } from '../../base'
import { initJSON } from '../../../utils'

import Dimensions from '../dimensions/Dimensions'
import { Color } from '../'

const Border = (props) => {
  const units = props.units ?? ['px']
  const format = props.format ?? 'hex'

  const {
    labelProps,
    fieldProps,
    descriptionProps } = useField(props)

  const [value, setValue] = useState(
    initJSON(props.value ?? '', {
      dimensions: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        unit: units[0],
        isLinked: false,
      },
      colorValue: 'rgba(0,0,0,1)'
    })
  )

  useEffect(() => props.onChange && props.onChange(value), [value])

  const setDimensions = dimensions => {
    setValue((prevState) => ({
      ...prevState,
      dimensions: {
        ...prevState.dimensions,
        ...dimensions,
      }
    }))
  }

  const setColorValue = colorValue => {
    setValue((prevState) => ({
      ...prevState,
      colorValue: colorValue,
    }))
  }

  return (
    <div className='tf-border'>
      {props.label &&
        <Label {...labelProps}>
          {props.label}
        </Label>}
      <input type="hidden" name={props.name ?? ''} value={JSON.stringify(value)} {...fieldProps} />
      <div className='tf-border-container'>
        <div className='tf-dimensions-container'>
          <Dimensions
            onChange={setDimensions}
            linked={props.linked}
            units={units}
            value={value.dimensions}
          />
        </div>
        <div className='tf-color-picker-container'>
          <Color
            onChange={setColorValue}
            value={value.colorValue}
            format={format}
            hasAlpha={props.hasAlpha ?? true}
          />
        </div>
      </div>
      {props.description && (
        <Description {...descriptionProps}>
          {props.description}
        </Description>
      )}
    </div>
  )
}

export default Border
