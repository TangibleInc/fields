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
  const linked = props.linked ?? false
  
  const {
    labelProps, 
    fieldProps, // Not sure where to use this one
    descriptionProps
  }= useField(props)
  
  const [value, setValue] = useState( 
    initJSON(
      props.value ?? '',
      {
        top    : 0,
        left   : 0,
        right  : 0,
        bottom : 0,
        unit   : units[0]
      }
    )
  )
  
  if( props.onChange ) {
    useEffect(() => props.onChange(value), [value])
  }

  const setAttribute = (number, position) => {
    setValue({
      ...value,
      [position]: number
    })
  }

  const setLinkedPosition = number => {
    setValue({
      top    : number,
      left   : number,
      right  : number,
      bottom : number,
      unit   : value.unit
    })
  }

  let groupClasses = 'tf-dimensions-number-groups'
  if( linked ) groupClasses += ' tf-dimensions-number-groups-linked'

  return(
    <div class="tf-dimensions">
      { props.label &&
        <Label { ...labelProps }>
          { props.label }
        </Label> }
      <input type="hidden" name={ props.name ?? '' } value={ JSON.stringify(value) } { ...fieldProps } />
      <div class="tf-dimensions-container">
        <div class={ groupClasses }>
          { ['top', 'left', 'right', 'bottom'].map(position => (
            <Number 
              value={ value[position] ?? 0 } 
              name={ position }
              label={ false }
              description={ false }
              onChange={ number => linked 
                ? setLinkedPosition(number)
                : setAttribute(number, position) }
            />
          )) }          
        </div>
        <Select 
          label={ false }
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
        <Description { ...descriptionProps }>
          { props.description }
        </Description> }
    </div>
  )
}

export default Dimensions
