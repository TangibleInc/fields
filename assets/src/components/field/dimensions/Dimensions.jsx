import { 
  useState,
  useEffect 
} from 'react'

import { Item } from 'react-stately'
import { useField } from 'react-aria'

import {
  Label,
  Description, 
  Button
} from '../../base'

import Number from '../number/Number'
import Select from '../select/Select'

import { initJSON } from '../../../utils'

const Dimensions = props => {

  const units = props.units ?? ['px']
  const showToggle = props.linked === 'toggle' || props.linked === undefined

  const {
    labelProps, 
    fieldProps, // Not sure where to use this one
    descriptionProps
  }= useField(props)
  
  const [value, setValue] = useState( 
    initJSON(
      props.value ?? '',
      {
        top      : 0,
        left     : 0,
        right    : 0,
        bottom   : 0,
        unit     : units[0],
        isLinked : false
      }
    )
  )

  useEffect(() => props.onChange && props.onChange(value), [value])

  /**
   * Sync all values with top when isLinked change to true
   */
  useEffect(() => {
    value.isLinked && setLinkedPosition(value.top)
  }, [value.isLinked]);

  const setAttribute = (number, position) => {
    setValue({
      ...value,
      [position]: number,
    })
  }

  const setLinkedPosition = number => {
    setValue({
      ...value,
      top    : number,
      left   : number,
      right  : number,
      bottom : number,
    })
  }

  const setIsLinked = state => {
    setValue({
      ...value,
      isLinked: state,
    })
  }

  /**
   * We only rely on saved value when toggle is enabled, in other cases props change
   * won't be taken into account if we change between true and false
   */
  const isLinked = () => (
    showToggle 
      ? (value.isLinked ?? false)
      : props.linked
  )

  let groupClasses = 'tf-dimensions-number-groups'
  if( isLinked() ) groupClasses += ' tf-dimensions-number-groups-linked'

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
              onChange={ number => isLinked()
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
        { showToggle &&
          <Button type={"action"} onPress={ () => setIsLinked(!value.isLinked) }>
            <span className="dashicons dashicons-admin-links"></span>
          </Button>
        }
      </div>
      { props.description &&
        <Description { ...descriptionProps }>
          { props.description }
        </Description> }
    </div>
  )
}

export default Dimensions
