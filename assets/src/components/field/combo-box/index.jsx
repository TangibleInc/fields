import { 
  useState, 
  useEffect
} from 'react'

import {
  Item, 
  Section,
  useAsyncList
} from 'react-stately'

import { get } from '../../../requests'
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
  
  /**
   * Async search
   * 
   * @see https://react-spectrum.adobe.com/react-aria/useComboBox.html#asynchronous-loading
   */
   const list = props.isAsync
     ? useAsyncList({
        async load({ filterText }) {
        
          const results = await get(props.searchUrl ?? '', {
            ...(props.asyncArgs ?? {}),
            search: filterText
          })
        
          return {
            items: (results ?? []).map(item => ({id: item.id, name: item.title }))
          }
      }
    })
    : false

  return(
    <>
      <input type="hidden" name={ props.name ?? '' } value={ value } />
      <ComboBox 
        focusStrategy={ 'first' }
        label={ props.label ?? null }
        description={ props.description ?? false }
        selectedKey={ value } 
        onSelectionChange={ setValue }
        onFocusChange={ props.onFocusChange ?? false }
        autoFocus={ props.autoFocus ?? false }
        { ...(
          props.isAsync 
            ? {
              items: list.items,
              inputValue: list.filterText,
              onInputChange: list.setFilterText
            } : {
              defaultItems: props.items ?? []
            } 
        )}
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
