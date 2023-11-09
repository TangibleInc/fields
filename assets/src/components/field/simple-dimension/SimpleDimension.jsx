import {
  useState,
  useEffect
} from 'react'

import { Item } from 'react-stately'
import { useField } from 'react-aria'

import {
  Label,
  Description
} from '../../base'

import Number from '../number/Number'
import Select from '../select/Select'

import { initJSON } from '../../../utils'

const Dimensions = props => {

  const units = props.units ?? ['px']
  const {
    labelProps,
    fieldProps, // Not sure where to use this one
    descriptionProps
  }= useField(props)

  const [value, setValue] = useState(
    initJSON(
      props.value ?? '',
      {
        value  : 0,
        unit   : units[0],
      }
    )
  )

  useEffect(() => props.onChange && props.onChange(value), [value])

  const setAttribute = (number, attribute) => {
    setValue({
      ...value,
      [attribute]: number,
    })
  }

  return(
    <div className="tf-simple-dimensions">
      { props.label &&
        <Label labelProps={ labelProps } parent={ props }>
          { props.label }
        </Label> }
      <input type="hidden" name={ props.name ?? '' } value={ JSON.stringify(value) } { ...fieldProps } />
      <div className="tf-simple-dimensions-container">
        <div>
          <Number
            value={ value['value'] ?? 0 }
            name={ 'value' }
            label={ 'Dimension number' }
            labelVisuallyHidden={ true }
            description={ false }
            onChange={ number => setAttribute(number, 'value') }
          />
        </div>
        <Select
          label={ 'Dimension unit' }
          labelVisuallyHidden={ true }
          description={ false }
          selectedKey={ value.unit ?? 'px' }
          onSelectionChange={ unit => setAttribute(unit, 'unit') }
          placeholder={ 'unit' }
        >
          { units.map(unit =>(
            <Item key={ unit }>{ unit }</Item>
          )) }
        </Select>
      </div>
      { props.description &&
      <Description descriptionProps={ descriptionProps } parent={ props }>
        { props.description }
      </Description> }
    </div>
  )
}

export default Dimensions
