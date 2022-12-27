import { 
  useState, 
  useEffect
} from 'react'

import {
  Item, 
  Section
} from 'react-stately'

import ComboBox from './ComboBox'
import AsyncComboBox from './AsyncComboBox'
import MultipleComboBox from './MultipleComboxBox'

import { getOptions } from '../../../utils'

/**
 * Export used when initialized from a php functions, or inside a repeater
 * 
 * There is 2 kind of ComboBox component (async and regular). We use separate components
 * for both because the returned value is different
 * 
 * A regular combox box return just the value (or a comma separated list a value if multiple)
 * but the async combox return an object with the value and the label for each element
 * 
 * @see control-list.js
 */
export default props => {
  
  const [value, setValue] = useState(props.value ?? null)

  if( props.onChange ) {
    useEffect(() => props.onChange(value), [value])
  }

  const children = item => item.choices 
    ? <Section key={ item.value ?? '' } title={ item.label ?? '' } items={ item.choices ?? [] }>
        { item => <Item key={ item.value ?? '' }>{ item.label ?? '' }</Item> }
      </Section>
    : <Item key={ item.value ?? '' }>{ item.label ?? '' }</Item>

  if( props.multiple ) {
    return(
      <>
        <input type="hidden" name={ props.name ?? '' } value={ value } />
        <MultipleComboBox 
          { ...props }
          onChange={ values => setValue(values.join(',')) }
          value={ value }
        >
          { children }
        </MultipleComboBox>
      </>
    )
  }

  return(
    <>
      <input type="hidden" name={ props.name ?? '' } value={ value } />
      { props.isAsync
        ? <AsyncComboBox { ...props }>
            { children }
          </AsyncComboBox>
        : <ComboBox 
            focusStrategy={ 'first' }
            label={ props.label ?? null }
            description={ props.description ?? false }
            selectedKey={ value } 
            onSelectionChange={ setValue }
            onFocusChange={ props.onFocusChange ?? false }
            autoFocus={ props.autoFocus ?? false }
            defaultItems={ getOptions(props.choices ?? {}) }
          >
            { children }
          </ComboBox> }
    </>  
  )
}
