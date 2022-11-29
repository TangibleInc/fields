import { 
  useState, 
  useEffect
} from 'react'

import {
  Item, 
  Section
} from 'react-stately'

import ComboBox from './ComboBox'

/**
 * Export used when initialized from a php functions, or inside a repeater
 * 
 * @see control-list.js
 */
export default props => {
  
  const [value, setValue] = useState(props.value ?? null)
  
  if( props.onChange ) {
    useEffect( () => props.onChange(value), [value])
  }

  return(
    <>
      <input type="hidden" name={ props.name ?? '' } value={ value } />
      <ComboBox 
        focusStrategy={ 'first' }
        label={ props.label ?? null }
        description={ props.description ?? false }
        defaultItems={ props.items ?? [] }
        selectedKey={ value } 
        onSelectionChange={ setValue }
        onFocusChange={ props.onFocusChange ?? false }
        autoFocus={ props.autoFocus ?? false }
      >
        { item => item.children 
          ? <Section key={ item.name } title={ item.name } items={ item.children }>
              { item => <Item key={ item.id }>{ item.name }</Item> }
            </Section>
          : <Item key={ item.id }>{ item.name }</Item> }
      </ComboBox>
    </>  
  )
}
