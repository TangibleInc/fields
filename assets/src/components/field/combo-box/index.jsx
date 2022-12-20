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
import { getOptions } from '../../../utils'

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
        
          const data = {
            ...(props.asyncArgs ?? {}),
            search: filterText
          }

          /**
           * We support 2 ways to get async result, either by fetching an given url or by
           * using our internal ajax module. If props.ajaxAction is defined, it means we rely 
           * on our internal module
           * 
           * @see https://docs.tangible.one/modules/plugin-framework/ajax/
           */
          const results = props.ajaxAction
            ? await Tangible?.ajax(props.ajaxAction, data)
            : await get(props.searchUrl ?? '', data) 
          
          return {
            items: getOptions(
              (results ?? []).reduce((items, item) => ({ ...items, [item.id]: item.title }), {})
            )
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
              defaultItems: getOptions(props.choices ?? {})
            } 
        )}
      >
        { item => item.choices 
          ? <Section key={ item.value ?? '' } title={ item.label ?? '' } items={ item.choices ?? [] }>
              { item => <Item key={ item.value ?? '' }>{ item.label ?? '' }</Item> }
            </Section>
          : <Item key={ item.value ?? '' }>{ item.label ?? '' }</Item> }
      </ComboBox>
    </>  
  )
}
