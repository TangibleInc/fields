import { 
  useState, 
  useEffect 
} from 'react'

import { useAsyncList } from 'react-stately'
import { get } from '../../../requests'

import ComboBox from './ComboBox'

const AsyncComboBox = props => {
  
  const [value, setValue] = useState(props.value ?? null)

  if( props.onChange ) {
    useEffect( () => props.onChange(value), [value])
  }

  /**
   * Async search
   * 
   * @see https://react-spectrum.adobe.com/react-aria/useComboBox.html#asynchronous-loading
   */
  const list = useAsyncList({
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

  return(
    <ComboBox 
      focusStrategy={ 'first' }
      label={ props.label ?? null }
      description={ props.description ?? false }
      selectedKey={ props.value ?? '' } 
      onSelectionChange={ props.onChange ?? false }
      onFocusChange={ props.onFocusChange ?? false }
      autoFocus={ props.autoFocus ?? false }
      items={ list.items }
      inputValue={ list.filterText }
      onInputChange={ list.setFilterText }
    >
      { props.children }
    </ComboBox>
  )
}

export default AsyncComboBox
