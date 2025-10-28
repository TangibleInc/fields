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
    descriptionProps 
  } = useField(props)

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
      color: 'rgba(0,0,0,1)'
    })
  )

  useEffect(() => props.onChange && props.onChange(value), [value])

  const handleData = value => {
    if (typeof value === 'string') {
      setValue((prevState) => ({
        ...prevState,
        color: value,
      }))
    } else {
      setValue((prevState) => ({
        ...prevState,
        dimensions: {
          ...prevState.dimensions,
          ...value,
        }
      }))
    }
  }

  return (
    <div className='tf-border'>
      {props.label &&
        <Label labelProps={ labelProps } parent={ props }>
          {props.label}
        </Label>}
      <input type="hidden" name={props.name ?? ''} value={JSON.stringify(value)} {...fieldProps} />
      <div className='tf-border-container'>
        <div className='tf-border-dimensions-container'>
          <Dimensions
            label={ 'Border dimensions' }
            labelVisuallyHidden={ true }
            onChange={handleData}
            linked={props.linked}
            units={units}
            value={value.dimensions}
          />
        </div>
        <div className='tf-border-color-picker-container'>
          <Color
            label={ 'Border Color' }
            labelVisuallyHidden={ true }
            onChange={handleData}
            value={value.color}
            format={format}
            hasAlpha={props.hasAlpha ?? true}
          />
        </div>
      </div>
      {props.description && (
        <Description descriptionProps={ descriptionProps } parent={ props }>
          {props.description}
        </Description>
      )}
    </div>
  )
}

export default Border
